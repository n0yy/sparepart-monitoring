import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Link from "next/link";
import { AiOutlineLogin } from "react-icons/ai";

export default function Home() {
  return (
    <>
      <section className="w-full min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold mb-5">
            Welcome to Engineering Pulogadung
          </h1>
          <span className="text-2xl -mt-5 mb-7 text-primary/90">
            Smarter Maintenance, Better Performance!
          </span>

          <div className="flex justify-evenly items-center gap-4 carousel rounded-box">
            <Card
              title="Monitoring Sparepart Lifetime in Real Time"
              description="Stay informed with accurate data. Anytime and anywhere."
              image="/images/sparepart-1.jpg"
              link="/monitoring-sparepart-lifetime-in-real-time"
            />
            <Card
              title="Optimize Your Maintenance Workflow"
              description="From planning to action. Track your sparepart effortlessly"
              image="/images/sparepart-3.jpg"
              link="/optimize-your-maintenance-workflow"
            />
            <Card
              title="Tracking Sparepart for Smarter Operations"
              description="Access detail insight on your phone, tablet, laptop or even Factory TV"
              image="/images/sparepart-2.jpg"
              link="/tracking-sparepart-for-smarter-operations"
            />
          </div>
          <Link
            href="/auth/login"
            className="absolute top-10 right-10 flex items-center text-primary-content hover:text-primary transition-all duration-100"
          >
            Login
            <AiOutlineLogin size={21} className="ml-2 mt-1" />
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
