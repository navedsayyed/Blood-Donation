import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, Heart, Users, Award, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [selectedBloodType, setSelectedBloodType] = useState('A+');
  const [selectedDonationType, setSelectedDonationType] = useState('red-blood-cells');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow images with your donation process photos
  const donationProcessImages = [
    { 
      src: `${import.meta.env.BASE_URL}images/donation-step-1.jpg`, 
      alt: 'Friendly phlebotomist greeting a smiling donor',
      caption: 'Step 1: Warm Welcome'
    },
    { 
      src: `${import.meta.env.BASE_URL}images/donation-step-2.jpg`, 
      alt: 'Donor comfortably seated during donation',
      caption: 'Step 2: Comfortable Process'
    },
    { 
      src: `${import.meta.env.BASE_URL}images/donation-step-3.jpg`, 
      alt: 'Blood donation in progress',
      caption: 'Step 3: Making a Difference'
    },
    { 
      src: `${import.meta.env.BASE_URL}images/donation-step-4.jpg`, 
      alt: 'Donor enjoying refreshments',
      caption: 'Step 4: Relax & Refresh'
    },
    { 
      src: `${import.meta.env.BASE_URL}images/donation-step-5.jpg`, 
      alt: 'Donor leaving with accomplishment',
      caption: 'Step 5: Be a Hero'
    },
  ];

  // Auto-advance slideshow every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % donationProcessImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [donationProcessImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % donationProcessImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + donationProcessImages.length) % donationProcessImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const compatibilityMap: Record<string, { donors: string[]; recipients: string[] }> = {
    'A+': { donors: ['O+', 'O-', 'A+', 'A-'], recipients: ['A+', 'AB+'] },
    'O+': { donors: ['O+', 'O-'], recipients: ['O+', 'A+', 'B+', 'AB+'] },
    'B+': { donors: ['O+', 'O-', 'B+', 'B-'], recipients: ['B+', 'AB+'] },
    'AB+': { donors: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'], recipients: ['AB+'] },
    'A-': { donors: ['O-', 'A-'], recipients: ['A+', 'A-', 'AB+', 'AB-'] },
    'O-': { donors: ['O-'], recipients: ['Everyone'] },
    'B-': { donors: ['O-', 'B-'], recipients: ['B+', 'B-', 'AB+', 'AB-'] },
    'AB-': { donors: ['O-', 'A-', 'B-', 'AB-'], recipients: ['AB+', 'AB-'] },
  };

  const donationTypes = {
    'red-blood-cells': {
      title: 'Packed Red Blood Cells',
      whatIsIt: 'Blood Collected straight from the donor into a blood bag and mixed with an anticoagulant is called as whole blood. This collected whole blood is then centrifuged and red cell, platelets and plasma are separated. The separated Red cells are mixed with a preservative to be called as packed red blood cells.',
      whoCanDonate: 'You need to be 18-65 years old, weight 45kg or more and be fit and healthy.',
      useFor: 'Correction of severe anemia in a number of conditions and blood loss in case of child birth, surgery or trauma settings.'
    },
    'plasma': {
      title: 'Plasma',
      whatIsIt: 'Plasma is the liquid portion of blood. It is composed of 90% water and contains proteins, antibodies, clotting factors, and other important substances. Plasma is separated from whole blood through a process called apheresis.',
      whoCanDonate: 'You need to be 18-65 years old, weight 50kg or more, and be in good health. Plasma can be donated more frequently than whole blood.',
      useFor: 'Treatment of patients with liver failure, severe infections, burns, and blood clotting disorders. Also used for patients with immune deficiencies.'
    },
    'platelets': {
      title: 'Platelets',
      whatIsIt: 'Platelets are tiny cell fragments that help blood clot and stop bleeding. They are collected through apheresis, where blood is drawn, platelets are separated, and the rest is returned to the donor.',
      whoCanDonate: 'You need to be 18-65 years old, weight 50kg or more, have good platelet count, and be in excellent health. Platelet donation takes about 2 hours.',
      useFor: 'Cancer patients undergoing chemotherapy, transplant patients, patients with blood disorders, and those undergoing major surgeries.'
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-red-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center">
                <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white whitespace-nowrap">Blood-O</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/register-donor')} 
                className="text-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap"
              >
                Register as Donor
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')} 
                className="text-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-4"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-white to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Donate Blood, <span className="text-red-600">Save Lives</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Your single blood donation can save up to three lives. Join thousands of heroes making a difference every day.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/register-donor')} size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  Become a Donor
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button onClick={() => navigate('/login')} variant="outline" size="lg">
                  Sign In
                </Button>
              </div>
            </div>
            
            {/* Automatic Slideshow */}
            <div className="relative">
              <div className="relative w-full h-96 bg-gray-100 overflow-hidden rounded-2xl shadow-2xl">
                {/* Slides */}
                {donationProcessImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image: ${image.src}`);
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    {/* Caption overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                      <p className="text-white text-xl font-semibold drop-shadow-lg">{image.caption}</p>
                    </div>
                  </div>
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-red-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-red-600" />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {donationProcessImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'bg-white w-8'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Lives Saved Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-red-100 hover:border-red-300 transition-all hover:shadow-lg">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">3</h3>
                <p className="text-sm text-gray-600 font-medium">Lives Saved Per Donation</p>
              </div>
            </div>

            {/* Registered Donors Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-red-100 hover:border-red-300 transition-all hover:shadow-lg">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">1000+</h3>
                <p className="text-sm text-gray-600 font-medium">Registered Donors</p>
              </div>
            </div>

            {/* Successful Donations Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-red-100 hover:border-red-300 transition-all hover:shadow-lg">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                  <Award className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">5000+</h3>
                <p className="text-sm text-gray-600 font-medium">Successful Donations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn About Donation Section - Compact design */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-red-700 mb-6">Learn About Donation</h2>
          
          {/* Blood Type Selector */}
          <div className="mb-8">
            <p className="text-center text-gray-700 text-base font-medium mb-4">Select your Blood Type</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedBloodType(type)}
                  className={`px-6 py-3 border-2 rounded-lg text-lg font-bold transition-all duration-200 ${
                    selectedBloodType === type
                      ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                      : 'bg-white text-gray-800 border-red-300 hover:border-red-500 hover:shadow-sm'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Blood Compatibility Cards - Visible on all devices */}
            <div className="space-y-4 order-1 lg:order-1">
              {/* You can take from card */}
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-5 shadow-md border border-orange-200">
                <div className="flex items-center gap-5">
                  {/* User silhouette icon */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-orange-300/70"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-11 rounded-t-full bg-orange-300/70"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">You can take from</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {compatibilityMap[selectedBloodType]?.donors.join('  ') || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* You can give to card */}
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-5 shadow-md border border-blue-200">
                <div className="flex items-center gap-5">
                  {/* User silhouette icon */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-blue-300/70"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-11 rounded-t-full bg-blue-300/70"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">You can give to</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {compatibilityMap[selectedBloodType]?.recipients.join('  ') || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image section - visible on all devices */}
            <div className="relative flex flex-col justify-center order-2 lg:order-2">
              <div className="max-w-md mx-auto lg:mx-0">
                <div className="relative">
                  <img 
                    src={`${import.meta.env.BASE_URL}images/donation-illustration.png`}
                    alt="Blood donation process illustration" 
                    className="w-full h-auto rounded-xl shadow-lg"
                    onError={(e) => {
                      // Fallback to placeholder if image not found
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <p className="text-center mt-4 text-base font-medium text-gray-700">
                  One Blood Donation can save upto <span className="text-red-600 font-bold text-lg">Three Lives</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Donation Section - matching your screenshot */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-red-700 mb-6">Types of Donation</h2>
          <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
            The average human body contains about five litres of blood, which is made of several cellular and non-cellular components such as <span className="text-red-600 font-semibold">Red blood cell, Platelet, and Plasma.</span>
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <button 
                onClick={() => setSelectedDonationType('red-blood-cells')}
                className={`w-full text-left px-6 py-4 rounded font-semibold transition-colors ${
                  selectedDonationType === 'red-blood-cells'
                    ? 'bg-red-50 border-l-4 border-red-600 text-red-700'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-l-4 border-transparent'
                }`}
              >
                Packed Red Blood Cells
              </button>
              <button 
                onClick={() => setSelectedDonationType('plasma')}
                className={`w-full text-left px-6 py-4 rounded font-semibold transition-colors ${
                  selectedDonationType === 'plasma'
                    ? 'bg-red-50 border-l-4 border-red-600 text-red-700'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-l-4 border-transparent'
                }`}
              >
                Plasma
              </button>
              <button 
                onClick={() => setSelectedDonationType('platelets')}
                className={`w-full text-left px-6 py-4 rounded font-semibold transition-colors ${
                  selectedDonationType === 'platelets'
                    ? 'bg-red-50 border-l-4 border-red-600 text-red-700'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-l-4 border-transparent'
                }`}
              >
                Platelets
              </button>
            </div>

            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">What is it?</h3>
                  <p className="text-gray-700 mb-6">
                    {donationTypes[selectedDonationType as keyof typeof donationTypes].whatIsIt}
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Who can donate?</h3>
                  <p className="text-gray-700 mb-6">
                    {donationTypes[selectedDonationType as keyof typeof donationTypes].whoCanDonate}
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Used For?</h3>
                  <p className="text-gray-700">
                    {donationTypes[selectedDonationType as keyof typeof donationTypes].useFor}
                  </p>
                </CardContent>
              </Card>

              <div className="mt-8 text-center">
                <Button onClick={() => navigate('/register-donor')} size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  Find Nearest Blood Center To Donate
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-red-700 mb-12">Why Donate Blood?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-lg">Save Lives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Your donation can save up to 3 lives in emergencies</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-lg">Help Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Support patients in your local hospitals and community</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-lg">Health Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Regular donation can reduce risk of heart disease</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Droplet className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-lg">Always Needed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Blood cannot be manufactured - only donated</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join our community of life-savers today. Register as a donor and be ready to help when someone needs you most.
          </p>
          <Button onClick={() => navigate('/register-donor')} size="lg" className="bg-white text-red-600 hover:bg-gray-100">
            Register Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                <Droplet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Blood-O</span>
            </div>
            
            {/* Tagline */}
            <p className="text-gray-300 text-lg font-medium">
              Saving lives, one donation at a time.
            </p>
            
            {/* Divider */}
            <div className="max-w-xs mx-auto border-t border-gray-700 my-6"></div>
            
            {/* Copyright and Credits */}
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">
                © 2025 Blood-O. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm">
                Made with <span className="text-red-500">❤</span> by{' '}
                <a 
                  href="https://github.com/navedsayyed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white font-semibold hover:text-red-400 transition-colors"
                >
                  Naved A. Sayyed
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
