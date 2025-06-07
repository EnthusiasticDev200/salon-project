import { motion } from "framer-motion";
import Button from "../ui/Button";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserAuthContext } from "../Context/UserAuthContext";
import MotionDiv from "../Layout/MotionDiv";

const Services = () => {
  const { user } = useContext(UserAuthContext)
  console.log(sessionStorage.getItem('userInfo'));

  const services = [
    {
      title: "Signature Fade",
      icon: (
        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 12H3M21 12h-2M7 12v-4a4 4 0 0 1 8 0v4" />
        </svg>
      ),
      desc: "Precision fades that turn heads — low, mid, high, or custom. Always sharp, never sloppy.",
    },
    {
      title: "Beard Sculpt & Line-Up",
      icon: (
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 4v5c0 6.075 4.925 11 11 11h5" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      desc: "Edges sharper than your jawline. We shape, trim, and line your beard to perfection.",
    },
    {
      title: "Hot Towel Shave",
      icon: (
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 15s1-1 4-1 4 1 4 1 1-1 4-1 4 1 4 1" />
          <path d="M4 19s1-1 4-1 4 1 4 1 1-1 4-1 4 1 4 1" />
        </svg>
      ),
      desc: "Classic razor shave with a relaxing hot towel treatment. Because your face deserves it.",
    },
    {
      title: "Full Groom Package",
      icon: (
        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12h18M12 3v18M7 7h10v10H7z" />
        </svg>
      ),
      desc: "Fade + beard + line-up + shave. One session. Maximum glow-up.",
    },
    {
      title: "Hair Braiding",
      icon: (
        <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 2v2m0 4v2m0 4v2m0 4v2" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      desc: "Clean braids, fresh parts, and protective styles. Rock your crown, your way.",
    },
    {
      title: "Custom Cuts",
      icon: (
        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 17l6-6-6-6m12 0h6v12h-6z" />
        </svg>
      ),
      desc: "Got an idea? Bring it. We freestyle too — just show a pic or describe the vibe.",
    },
    {
      title: "Walk-ins & Appointments",
      icon: (
        <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M8 7V3m8 4V3M5 11h14M5 19h14M5 15h14" />
          <rect width="20" height="18" x="2" y="4" rx="2" />
        </svg>
      ),
      desc: "Book ahead or roll through — either way, we’ve got you covered.",
    },
  ];

  return (
    <div className='py-12 px-6 md:px-24' id='services'>
      <MotionDiv>
        <div className="my-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Services</h2>
          <p className="text-xl font-light">See what attracts people to us</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-[#222] rounded-2xl p-6 shadow-md hover:shadow-lg transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="text-4xl mb-3">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-gray-300">{service.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex my-4 justify-center items-center"
        >
          <Link to={`${ user ? 'customer/add-appointment' : 'customer/login' }`}>
            <Button className={'py-4 px-8'}>
              Book an Appointment
            </Button>
          </Link>
        </motion.div>
      </MotionDiv>
    </div>
  )
}

export default Services