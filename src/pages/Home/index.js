import Nav from "../../components/Nav";
import Hexagon from "../../components/clips/Hexagon";

import Header from "./Header";
import Services from "./Services";
import HowItWorks from "./HowItWorks";
import About from "./About";
import Footer from "./Footer";

import Robot from "../../assets/robot.png";

import React from 'react'

export default function Home() {
  return (
    <div className="relative overflow-x-hidden min-h-screen">
        <Hexagon 
            width='1158.45px'
            height='1542.14px'
            top='-307px'
            left='-599.12px'
            rotation='71'
            background='#39BFA8'
        />
        <Hexagon 
            width='1001.18px'
            height='1251.25px'
            top='-77.63px'
            left='720px'
            rotation='73'
            background='#8EE0A1'
        />
        <img src={Robot} alt="robot assistant standing and looking" className="absolute top-80 right-12"/>
        <Nav />
        <Header />
        <Services />
        <HowItWorks />
        <About />
        <Footer />
    </div>
  )
}
