import React from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/home/HeroSection';
import FeaturedTours from '../components/home/FeaturedTours';
import PromotionSection from '../components/home/PromotionSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import TestimonialSection from '../components/home/TestimonialSection';
import NewsletterSection from '../components/home/NewsletterSection';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();


  return (
    <div className="animate-fade-in">

      <HeroSection />
      <FeaturedTours />
      <PromotionSection />
      <WhyChooseUs />
      <TestimonialSection />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;