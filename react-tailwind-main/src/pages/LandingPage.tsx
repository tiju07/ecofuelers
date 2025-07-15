import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Leaf, BarChart, Bell, Package, Lightbulb } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel slides data
  const slides = [
    {
      title: 'Sustainable Inventory Management',
      description: 'Reduce waste and optimize resources with our eco-friendly solutions.',
      icon: <Leaf className='h-16 w-16 text-[#2E7D32]' />,
    },
    {
      title: 'AI-Powered Insights',
      description: 'Leverage AI to make smarter, data-driven decisions.',
      icon: <Lightbulb className='h-16 w-16 text-[#2E7D32]' />,
    },
    {
      title: 'Real-Time Alerts',
      description: 'Stay informed with timely notifications to prevent overstocking.',
      icon: <Bell className='h-16 w-16 text-[#2E7D32]' />,
    },
  ];

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Feature cards data
  const features = [
    {
      title: 'Inventory Management',
      description: 'Track and manage supplies efficiently to minimize waste.',
      icon: <Package className='h-10 w-10 text-[#2E7D32]' />,
    },
    {
      title: 'AI Recommendations',
      description: 'Receive tailored suggestions to optimize stock levels.',
      icon: <Lightbulb className='h-10 w-10 text-[#2E7D32]' />,
    },
    {
      title: 'Real-Time Alerts',
      description: 'Get notified about overstocking or expiring items.',
      icon: <Bell className='h-10 w-10 text-[#2E7D32]' />,
    },
    {
      title: 'Detailed Reports',
      description: 'Analyze usage trends and cost savings with insightful reports.',
      icon: <BarChart className='h-10 w-10 text-[#2E7D32]' />,
    },
  ];

  return (
    <div className='min-h-screen bg-green-50/80 backdrop-blur-md'>
      {/* Hero Section */}
      <section className='animate-fade-in px-4 py-20 text-center'>
        <div className='container mx-auto'>
          <h1 className='mb-4 text-4xl font-bold text-[#2E7D32] md:text-5xl'>
            SustainaStock: Sustainable Inventory Solutions 🌿
          </h1>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600'>
            Empower your business with eco-conscious inventory management, AI-driven insights, and
            real-time alerts to reduce waste and boost efficiency.
          </p>
          <div className='flex justify-center gap-4'>
            <Button
              variant={'primary'}
              size={'lg'}
              onClick={() => navigate('/register')}
              className='rounded-lg bg-[#2E7D32] px-6 py-3 text-white transition-transform duration-300 hover:scale-105 hover:bg-[#1B5E20]'
            >
              Get Started
            </Button>
            <Button
              variant={'primary'}
              size={'lg'}
              onClick={() => navigate('/login')}
              className='rounded-lg border border-[#2E7D32] bg-white px-6 py-3 text-[#2E7D32] transition-transform duration-300 hover:scale-105 hover:bg-green-100'
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className='bg-white/90 px-4 py-12'>
        <div className='container mx-auto'>
          <div className='relative h-[35vh] overflow-hidden rounded-lg shadow-lg'>
            <div
              className='flex transition-transform duration-500 ease-in-out'
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className='flex min-w-full items-center justify-center p-8'>
                  <div className='max-w-lgtext-center justify-items-center'>
                    {slide.icon}
                    <h2 className='mt-4 text-2xl font-semibold text-[#2E7D32]'>{slide.title}</h2>
                    <p className='mt-2 text-gray-600'>{slide.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-4 flex justify-center gap-2'>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 w-3 rounded-full transition ${
                    currentSlide === index ? 'bg-[#2E7D32]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='px-4 py-12'>
        <div className='container mx-auto'>
          <h2 className='mb-8 text-center text-3xl font-bold text-[#2E7D32]'>
            Why Choose SustainaStock?
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature, index) => (
              <Card
                key={index}
                className='animate-fade-in rounded-lg border border-green-200 bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className={''}>
                  <div className='flex items-center space-x-2'>
                    {feature.icon}
                    <CardTitle className='text-xl font-semibold text-[#2E7D32]'>
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className={''}>
                  <p className='text-gray-600'>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className='bg-[#2E7D32] px-4 py-6 text-white'>
        <div className='container mx-auto text-center'>
          <p className='mb-2 text-sm'>© 2025 SustainaStock. All rights reserved.</p>
          <div className='flex justify-center gap-4'>
            <a href='#' className='text-[#A5D6A7] transition hover:text-white'>
              Contact Us
            </a>
            <a href='#' className='text-[#A5D6A7] transition hover:text-white'>
              Privacy Policy
            </a>
            <a href='#' className='text-[#A5D6A7] transition hover:text-white'>
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
