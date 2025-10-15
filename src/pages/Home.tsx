import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, Heart, Users, Award, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [selectedBloodType, setSelectedBloodType] = useState('A+');
  const [selectedDonationType, setSelectedDonationType] = useState('red-blood-cells');

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Droplet className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xl font-bold text-white">Blood-O</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/register-donor')} className="text-white hover:bg-white/20">
                Register as Donor
              </Button>
              <Button variant="ghost" onClick={() => navigate('/login')} className="text-white hover:bg-white/20">
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
            <div className="relative">
              <img src="/blood-drop-37715.png" alt="Blood donation" className="w-full h-96 object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg border-t-4 border-red-600">
              <CardContent className="pt-8">
                <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-gray-900 mb-2">3</h3>
                <p className="text-gray-600">Lives Saved Per Donation</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg border-t-4 border-red-600">
              <CardContent className="pt-8">
                <Users className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-gray-900 mb-2">1000+</h3>
                <p className="text-gray-600">Registered Donors</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg border-t-4 border-red-600">
              <CardContent className="pt-8">
                <Award className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-gray-900 mb-2">5000+</h3>
                <p className="text-gray-600">Successful Donations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learn About Donation Section - matching your screenshot */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-red-700 mb-12">Learn About Donation</h2>
          
          {/* Blood Type Selector */}
          <div className="mb-8">
            <p className="text-center text-gray-600 mb-4">Select your Blood Type</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedBloodType(type)}
                  className={`px-6 py-3 border-2 rounded-lg text-lg font-semibold transition-colors ${
                    selectedBloodType === type
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-800 border-red-600 hover:bg-red-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center mt-12">
            <div className="space-y-6">
              <Card className="bg-amber-100 border-none shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
                      <Droplet className="w-8 h-8 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">You can take from</h3>
                      <p className="text-xl font-semibold text-gray-800">
                        {compatibilityMap[selectedBloodType]?.donors.join(' ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sky-100 border-none shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-sky-200 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-8 h-8 text-sky-700" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">You can give to</h3>
                      <p className="text-xl font-semibold text-gray-800">
                        {compatibilityMap[selectedBloodType]?.recipients.join(' ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <img src="/placeholder.svg" alt="Donation illustration" className="w-full h-auto rounded-lg" />
              <p className="text-center mt-4 text-lg font-medium">
                One Blood Donation can save upto <span className="text-red-600 font-bold">Three Lives</span>
              </p>
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
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2025 Blood-O. Saving lives, one donation at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
