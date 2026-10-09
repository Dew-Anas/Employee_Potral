import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import HeroSection from "../../components/home/HeroSection";
import ServicesPreview from "../../components/home/ServicesPreview";
import HowItWorks from "../../components/home/HowItWorks";
import Testimonials from "../../components/home/Testimonials";
import ReviewCard from "../../components/home/ReviewCard";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <HeroSection />
        <ServicesPreview />
        <HowItWorks />
        <ReviewCard />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
};

export default Home;