const pool = require('../config/database-supabase');

class ProviderAccount {
  // Create a new provider account
  static async create(accountData) {
    const {
      provider_id,
      account_name,
      account_number,
      bank_name,
      currency = 'VND',
      is_default = true,
      metadata = {}
    } = accountData;

    const query = `
      INSERT INTO provider_accounts (
        provider_id, account_name, account_number, bank_name, currency, is_default, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [provider_id, account_name, account_number, bank_name, currency, is_default, JSON.stringify(metadata)];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  // Get account by ID
  static async findById(accountId) {
    const query = 'SELECT * FROM provider_accounts WHERE id = $1';
    const result = await pool.query(query, [accountId]);

    return result.rows[0];
  }

  // Get accounts by provider ID
  static async findByProviderId(providerId) {
    const query = 'SELECT * FROM provider_accounts WHERE provider_id = $1 ORDER BY is_default DESC, created_at DESC';
    const result = await pool.query(query, [providerId]);

    return result.rows;
  }

  // Get default account for provider
  static async getDefaultAccount(providerId) {
    const query = 'SELECT * FROM provider_accounts WHERE provider_id = $1 AND is_default = true LIMIT 1';
    const result = await pool.query(query, [providerId]);

    return result.rows[0];
  }

  // Update account
  static async update(accountId, updateData) {
    const {
      account_name,
      account_number,
      bank_name,
      currency,
      is_default,
      metadata
    } = updateData;

    const fields = ['updated_at = CURRENT_TIMESTAMP'];
    const values = [accountId];
    let paramCount = 1;

    if (account_name !== undefined) {
      paramCount++;
      fields.push(`account_name = $${paramCount}`);
      values.push(account_name);
    }

    if (account_number !== undefined) {
      paramCount++;
      fields.push(`account_number = $${paramCount}`);
      values.push(account_number);
    }

    if (bank_name !== undefined) {
      paramCount++;
      fields.push(`bank_name = $${paramCount}`);
      values.push(bank_name);
    }

    if (currency !== undefined) {
      paramCount++;
      fields.push(`currency = $${paramCount}`);
      values.push(currency);
    }

    if (is_default !== undefined) {
      paramCount++;
      fields.push(`is_default = $${paramCount}`);
      values.push(is_default);
    }

    if (metadata !== undefined) {
      paramCount++;
      fields.push(`metadata = $${paramCount}`);
      values.push(JSON.stringify(metadata));
    }

    const query = `
      UPDATE provider_accounts
      SET ${fields.join(', ')}
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete account
  static async delete(accountId) {
    const query = 'DELETE FROM provider_accounts WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [accountId]);

    return result.rows[0];
  }

  // Set default account (unset others for same provider)
  static async setDefault(accountId, providerId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Unset all default accounts for this provider
      await client.query(
        'UPDATE provider_accounts SET is_default = false WHERE provider_id = $1',
        [providerId]
      );

      // Set this account as default
      const result = await client.query(
        'UPDATE provider_accounts SET is_default = true WHERE id = $1 RETURNING *',
        [accountId]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = ProviderAccount;
