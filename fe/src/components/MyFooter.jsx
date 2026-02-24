import React from "react";
import { Footer } from "flowbite-react";
import {
  BsTelephone,
  BsEnvelope,
  BsGeoAlt
} from "react-icons/bs";

const HospitalFooter = () => {
  return (
    <Footer container className="bg-white border-t border-blue-200 flex flex-col rounded-none">
      
      {/* ======= COPYRIGHT FIRST ======= */}
      <div className="w-full text-center py-4 bg-blue-50 border-b border-blue-200">
        <Footer.Copyright
          href="#"
          by="Government Hospital Management System"
          year={new Date().getFullYear()}
        />
      </div>

      {/* ======= MAIN CONTENT ======= */}
      <div className="w-full px-6 lg:px-24 py-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-gray-700">

          {/* About Hospital */}
          <div>
            <Footer.Title className="text-blue-700" title="Our Hospital" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">About Us</Footer.Link>
              <Footer.Link href="#">Mission & Vision</Footer.Link>
              <Footer.Link href="#">Board of Directors</Footer.Link>
              <Footer.Link href="#">Patient Rights</Footer.Link>
            </Footer.LinkGroup>
          </div>

          {/* Services */}
          <div>
            <Footer.Title className="text-blue-700" title="Services" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Outpatient Care</Footer.Link>
              <Footer.Link href="#">Pharmacy Services</Footer.Link>
              <Footer.Link href="#">Emergency Unit</Footer.Link>
              <Footer.Link href="#">Laboratory Testing</Footer.Link>
            </Footer.LinkGroup>
          </div>

          {/* Support */}
          <div>
            <Footer.Title className="text-blue-700" title="Support" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Help Desk</Footer.Link>
              <Footer.Link href="#">Medical Records</Footer.Link>
              <Footer.Link href="#">FAQs</Footer.Link>
              <Footer.Link href="#">Report an Issue</Footer.Link>
            </Footer.LinkGroup>
          </div>

          {/* Contact */}
          <div>
            <Footer.Title className="text-blue-700" title="Contact" />
            <Footer.LinkGroup col>
              <div className="flex items-center gap-2">
                <BsTelephone className="text-blue-600" />
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <BsEnvelope className="text-blue-600" />
                <span>info@hospital.lk</span>
              </div>
              <div className="flex items-center gap-2">
                <BsGeoAlt className="text-blue-600" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </Footer.LinkGroup>
          </div>

        </div>
      </div>

      

    </Footer>
  );
};

export default HospitalFooter;
