import { User } from "lucide-react";
import {
  ecommerceImg,
  ecommerceSvg,
  bookingImg,
  bookingSvg,
  portfolioImg,
  portfolioSvg,
  restaurantImg,
  restaurantSvg,
  techImg,
  techSvg,
  codingSvg,
  creatingSvg,
  customizationSvg,
  sampleTheme,
  sampleTheme2,
  sampleTheme3,
  sampleTheme4,
  sampleTheme5,
  sampleThemePhone,
  // slide1,
  // slide2,
  // slide3,
  // slide4,
} from "./assets";

import slide1 from "./assets/Slide 1.png";
import slide2 from "./assets/Slide 2.png";
import slide3 from "./assets/Slide 3.png";
import slide4 from "./assets/Slide 4.png";

export const categories = [
  {
    id: 1,
    title: "E-commerce Sites",
    desc: "Sell products online with sleek, conversion-focused designs.",
    img: ecommerceImg,
    svg: ecommerceSvg,
  },

  {
    id: 2,
    title: "Booking Themes",
    desc: "Streamline appointments and reservations with ease.",
    img: bookingImg,
    svg: bookingSvg,
  },

  {
    id: 3,
    title: "Portfolio Templates",
    desc: "Showcase your work with clean, creative layouts.",
    img: portfolioImg,
    svg: portfolioSvg,
  },

  {
    id: 4,
    title: "Restaurant",
    desc: "Highlight your menu and attract diners effortlessly.",
    img: restaurantImg,
    svg: restaurantSvg,
  },

  {
    id: 5,
    title: "Tech Startup",
    desc: "Launch your next big idea with modern, bold designs.",
    img: techImg,
    svg: techSvg,
  },
];

export const whyChooseUs = [
  {
    id: 1,
    title: "Crafted by Experts",
    desc: "Built with precision and care by industry professionals.",
    svg: codingSvg,
  },
  {
    id: 2,
    title: "Curated Quality",
    desc: "Only the best, high-performance themes in the market.",
    svg: creatingSvg,
  },
  {
    id: 3,
    title: "Easy Customization",
    desc: "User-friendly & drag-and-drop templates for easy custmization.",
    svg: customizationSvg,
  },
];

export const themes = [
  {
    id: 1,
    title: "Minimalist Portfolio",
    excerpt: "Clean, modern design tailored for creatives and freelancers.",
    desc: "Minimalist Portfolio is the epitome of elegant simplicity, designed specifically for creatives who want their work to speak volumes without distractions. This theme employs a careful balance of whitespace, typography, and understated transitions that guide visitors' attention directly to your portfolio pieces. With optimized image loading and a responsive grid system, your projects will shine on any device while maintaining exceptional page speed scores.\n\nBeyond aesthetics, Minimalist Portfolio incorporates thoughtful UX patterns including subtle hover states, intuitive navigation, and accessibility-focused design choices. The theme includes specialized project detail templates, case study layouts, and customizable filtering options to organize your work by medium, client, or technique. For photographers, designers, illustrators, and other visual professionals, this theme provides the perfect backdrop to showcase your creative vision with sophistication and clarity.",
    price: 25,
    category: "Portfolio",
    img: sampleTheme,
    phoneImg: sampleThemePhone,
  },
  {
    id: 2,
    title: "Boldfolio",
    excerpt: "A bold and colorful portfolio theme to stand out.",
    desc: "Boldfolio breaks conventional portfolio design rules with its striking color palette, unexpected layout choices, and attention-grabbing animations that ensure your creative work leaves a lasting impression. This theme features customizable color schemes, allowing you to align the design with your personal brand while maintaining visual impact. The dynamic grid system automatically adjusts to showcase both horizontal and vertical pieces optimally, with smooth transitions that bring your portfolio to life.\n\nDesigned for the creative professional who refuses to blend in, Boldfolio includes interactive elements like parallax scrolling, reveal animations, and cursor-following effects that create an immersive browsing experience. The theme comes with built-in integrations for Instagram, Behance, and Dribbble, allowing you to unify your creative presence across platforms. Video backgrounds, WebGL effects, and animated SVGs are all supported, making this theme ideal for digital artists, motion designers, and multimedia creatives who push boundaries.\n\nBoldfolio doesn't sacrifice functionality for style—it includes advanced filtering capabilities, project tagging, and detailed analytics integration to help you understand which pieces resonate most with your visitors. The mobile experience has been crafted with the same attention to detail, ensuring your portfolio makes the same bold statement whether viewed on a desktop, tablet, or smartphone.",
    price: 20,
    discount: 15,
    category: "Portfolio",
    img: sampleTheme2,
    phoneImg: sampleThemePhone,
  },

  // Restaurant
  {
    id: 3,
    title: "Bistro Delight",
    excerpt: "A cozy and elegant theme designed for cafes and bistros.",
    desc: "Bistro Delight captures the intimate ambiance of neighborhood cafes and family-owned bistros through its warm color palette, handcrafted typography, and thoughtful layout designed to evoke the sensory pleasure of dining. The theme features specialized sections for daily specials, seasonal menus, and chef recommendations, with beautiful food photography templates that showcase your culinary creations. The homepage incorporates subtle animations mimicking the steam rising from a fresh cup of coffee or the gentle flicker of candlelight, creating an inviting digital atmosphere that reflects your establishment's charm.\n\nBuilt with the practical needs of small to medium restaurants in mind, Bistro Delight integrates seamlessly with popular reservation systems while offering an easy-to-update menu management system. The theme includes customizable event calendar functionality perfect for promoting cooking classes, tasting events, or live music nights. Location maps, operating hours widgets, and customer testimonial carousels are strategically positioned to provide visitors with essential information while maintaining the cozy aesthetic.\n\nMobile optimization ensures hungry customers can easily view your menu and make reservations on the go, with click-to-call functionality and mobile-specific layouts that prioritize the most sought-after information. The theme's photography-focused design includes specialized image optimization to ensure food images remain appetizing across all devices while maintaining fast loading times essential for hungry visitors with limited patience.",
    price: 30,
    category: "Restaurant",
    img: sampleTheme3,
    phoneImg: sampleThemePhone,
  },
  {
    id: 4,
    title: "Gourmet Pro",
    excerpt: "Modern layout built for upscale restaurants and chefs.",
    desc: "Gourmet Pro embodies the sophistication and attention to detail found in fine dining establishments, with a premium design language that communicates exclusivity and culinary excellence from the moment visitors arrive. The theme features cinematic full-screen video headers perfect for showcasing chef techniques, ingredient close-ups, or the elegant ambiance of your restaurant. Typography choices include refined serif fonts paired with modern sans-serif elements, creating a typographic hierarchy that mirrors the thoughtful progression of a tasting menu.\n\nDesigned specifically for Michelin-starred restaurants, upscale bistros, and celebrity chefs, Gourmet Pro includes specialized components like tasting menu displays with wine pairing options, chef biography sections, and restaurant philosophy statements that communicate your culinary vision. The reservation system integration supports deposit requirements, special occasion notes, and dietary restriction fields essential for high-end dining experiences. Interactive restaurant floor plans allow guests to select preferred seating areas, while virtual tours provide an immersive preview of the dining environment.\n\nThe theme's backend includes a robust event management system perfect for exclusive chef's table experiences, culinary masterclasses, or wine tasting events with limited seating. For restaurants with multiple locations or concepts, Gourmet Pro offers location-specific customization while maintaining brand consistency. Performance optimization ensures that the luxurious visual elements never compromise the user experience, maintaining the same level of excellence online that guests expect from your physical establishment.",
    price: 35,
    category: "Restaurant",
    img: sampleTheme4,
    phoneImg: sampleThemePhone,
  },

  // Booking
  {
    id: 5,
    title: "Bookify",
    excerpt: "A powerful booking theme for salons, clinics, and more.",
    desc: "Bookify transforms the often complicated appointment scheduling process into a seamless, intuitive experience for both clients and service providers. This comprehensive theme features a dynamic calendar system with real-time availability updates, service duration blocking, and buffer time management to prevent scheduling conflicts. The appointment interface allows clients to select specific staff members, service add-ons, and preferred time slots with a visual, step-by-step process that minimizes booking abandonment and maximizes conversion.\n\nDesigned with versatility in mind, Bookify adapts effortlessly to various service-based businesses including hair salons, medical clinics, consulting firms, and fitness studios. The theme includes customizable staff profiles with individual schedules, expertise highlights, and personal photo galleries to help clients connect with their service providers before booking. For businesses with multiple services, the intelligent categorization system and search functionality help clients quickly find exactly what they're looking for, while the recommendation engine suggests complementary services based on booking history and preferences.\n\nThe backend management system provides comprehensive booking analytics, client retention metrics, and schedule optimization suggestions to help business owners maximize efficiency. Automated email and SMS notifications reduce no-shows, while the client portal allows customers to manage their appointments, view service history, and access personalized promotions. The theme's responsive design ensures the booking process remains frictionless across all devices, with a simplified mobile booking flow designed specifically for on-the-go appointments.",
    price: 28,
    category: "Booking",
    img: sampleTheme5,
    phoneImg: sampleThemePhone,
  },
  {
    id: 6,
    title: "StayEase",
    excerpt: "An elegant booking theme for hotels and vacation rentals.",
    desc: "StayEase combines sophisticated aesthetics with powerful functionality to create the ultimate booking experience for hotels, resorts, and vacation property rentals. The theme showcases accommodations through immersive gallery carousels, virtual room tours, and interactive property maps that highlight amenities and nearby attractions. The intelligent room display system automatically adjusts to showcase available options for the selected dates, with dynamic pricing that reflects seasonal changes, length-of-stay discounts, and special promotions.\n\nThe booking engine at the heart of StayEase delivers a frictionless reservation experience with real-time availability checks, transparent pricing breakdowns, and secure payment processing. Guests can customize their stay with add-on packages, room preferences, and special requests, all within a streamlined checkout process designed to maximize conversion rates. The theme supports multi-room bookings, group reservations, and extended stays with specialized interfaces that simplify complex booking scenarios.\n\nStayEase extends beyond the booking process with pre-arrival communication templates, digital concierge services, and post-stay feedback collection to create a comprehensive guest journey. The theme includes specialized content blocks for highlighting local experiences, property policies, and seasonal offerings. With support for multiple languages, currency conversion, and region-specific tax calculations, StayEase serves international clientele with the same level of polish and professionalism. The mobile experience has been meticulously crafted to support the growing percentage of travelers who book accommodations on smartphones, ensuring no reservation opportunity is missed regardless of device.",
    price: 32,
    category: "Booking",
    img: sampleTheme,
    phoneImg: sampleThemePhone,
  },

  // Tech Startup
  {
    id: 7,
    title: "LaunchHub",
    excerpt: "A startup-friendly theme for product launches and SaaS.",
    desc: "LaunchHub has been engineered from the ground up to help startups convert visitors into users through strategic design choices and conversion-optimized layouts. The theme features an impactful above-the-fold section with animated product demonstrations, concise value propositions, and prominent call-to-action buttons that guide visitors into your acquisition funnel. The modular feature showcase uses progressive disclosure techniques to communicate product capabilities without overwhelming potential users, employing animations that illustrate functionality rather than just describing it.\n\nCreated with the startup journey in mind, LaunchHub includes specialized templates for different stages of growth—from pre-launch with email capture and countdown timers to established product with case studies and integration showcases. The theme's pricing table component allows for tiered plan comparison with highlighted recommended options and expandable feature lists. Testimonial displays are designed to build trust through social proof, with options for video testimonials, client logos, and detailed success stories that address common objection points.\n\nUnderstanding that startups often iterate quickly, LaunchHub provides a flexible component system that can evolve with your messaging and product offering. The theme includes A/B testing capabilities for key conversion elements, heatmap integration for user behavior analysis, and structured data implementation for improved SEO performance. For technical products, LaunchHub offers code snippet styling, API documentation templates, and developer-focused resources sections that maintain the theme's clean aesthetic while serving specialized content needs.",
    price: 29,
    category: "Tech Startup",
    img: sampleTheme,
    phoneImg: sampleThemePhone,
  },
  {
    id: 8,
    title: "Innovexa",
    excerpt: "High-tech aesthetic built for innovation-driven companies.",
    desc: "Innovexa pushes the boundaries of web design with cutting-edge visual elements that mirror the forward-thinking nature of technology innovators and digital disruptors. The theme employs subtle particle backgrounds, geometric animations, and three-dimensional design elements that create depth without sacrificing performance. Navigation patterns break from convention with horizontal scrolling sections, creative cursor interactions, and reveal effects that make exploring your site as innovative as the products or services you offer.\n\nDesigned for companies at the forefront of their industries, Innovexa includes specialized components for showcasing technological breakthroughs, complex product ecosystems, and technical specifications. The theme features interactive infographics, animated process flows, and comparison tools that simplify complex information for various audience knowledge levels. For AI, blockchain, IoT, and other cutting-edge technology companies, Innovexa offers visual metaphors and explanatory sections specifically designed to make abstract concepts tangible and compelling.\n\nBeyond aesthetics, Innovexa incorporates advanced functionality including WebGL demonstrations, interactive product configurators, and real-time data visualizations that can connect to your APIs to display dynamic information. The theme's architecture supports progressive web app capabilities, dark mode toggling, and reduced-motion accessibility options to serve diverse user preferences. Despite its visual sophistication, Innovexa maintains exceptional performance metrics through careful asset loading strategies, ensuring that innovative design never comes at the cost of user experience or search engine optimization.",
    price: 34,
    category: "Tech Startup",
    img: sampleTheme,
    phoneImg: sampleThemePhone,
  },

  // E-commerce
  {
    id: 9,
    title: "ShopNest",
    excerpt: "Flexible theme for fashion, lifestyle, and general e-commerce.",
    desc: "ShopNest delivers a versatile e-commerce foundation adaptable to virtually any product category through its thoughtfully designed product display systems and customizable shopping experience. The theme features multiple product grid layouts, list views, and collection displays with quick-view modals, wishlist functionality, and subtle hover effects that enhance product discovery without overwhelming shoppers. Category pages include intuitive filtering options, sorting capabilities, and pagination styles that maintain context as customers explore your catalog.\n\nProduct detail pages in ShopNest have been optimized through extensive user testing to present information in a conversion-focused hierarchy—leading with compelling imagery, followed by clear pricing, concise descriptions, and prominent add-to-cart actions. The theme includes specialized templates for different product types, from simple physical goods to complex products with multiple variants, customization options, or bundling possibilities. User-generated content sections integrate seamlessly with the design language, showcasing customer photos, video reviews, and detailed testimonials that build purchasing confidence.\n\nShopNest's checkout process has been streamlined to minimize abandonment, with a distraction-free cart review, express checkout options, and address auto-completion to reduce friction at critical conversion points. The theme includes specialized sections for promotion announcements, cross-selling recommendations, and inventory notifications that create urgency without appearing manipulative. For store owners, ShopNest provides flexible merchandising tools to highlight seasonal collections, bestsellers, or high-margin products through featured sections with scheduling capabilities.",
    price: 27,
    category: "Ecommerce",
    img: sampleTheme,
    phoneImg: "",
  },
  {
    id: 10,
    title: "ElectroMart",
    excerpt: "Designed for electronics and gadget stores.",
    desc: "ElectroMart addresses the unique challenges of selling technical products online through specialized design elements and functionality tailored specifically for electronics retailers. The theme features a technical specification display system that organizes complex product details into scannable, comparable formats—perfect for processors, smartphones, cameras, and other specification-driven purchases. Product imagery includes support for multiple angles, zoom functionality optimized for circuit details, and 360-degree product rotation to simulate the in-store examination process that electronics shoppers value.\n\nUnderstanding that electronics purchases often involve significant research, ElectroMart includes comprehensive comparison tools that allow shoppers to evaluate multiple products side-by-side across key specifications. The theme's review system is enhanced with verified purchaser badges, technical expertise indicators, and usage context information to help shoppers find feedback relevant to their needs. For products with compatibility concerns, the theme includes interactive compatibility checkers, accessory finders, and bundle builders that increase average order value while preventing return issues.\n\nElectroMart's layout has been optimized for complex navigation scenarios common in electronics retail, with mega-menu support, persistent category access, and intelligent search that understands technical terminology and model numbers. The theme includes specialized content blocks for technology guides, unboxing videos, and setup tutorials that add value throughout the customer journey. For international electronics retailers, ElectroMart offers voltage specification displays, region-specific warranty information sections, and shipping restriction notifications to create transparency around global shopping complexities.",
    price: 31,
    category: "Ecommerce",
    img: sampleTheme,
    phoneImg: "",
  },
];

export const heroSlides = [
  {
    id: 1,
    title: "Launch your business faster with powerful, modern tools",
    img: slide1,
  },
  {
    id: 2,
    title:
      "Build your site with high-performance features, speed, & optimization",
    img: slide2,
  },
  {
    id: 3,
    title: "Design with confidence using intuitive, professional tools",
    img: slide3,
  },
  {
    id: 4,
    title: "Choose from expertly crafted themes tailored for your brand",
    img: slide4,
  },
];

export const testimonials = [
  {
    id: 1,
    themTitle: "Minimalist Portfolio",
    themePrice: 25,
    img: sampleTheme,
    quote:
      "As a freelance designer, this theme gave my portfolio a clean and professional edge—clients started taking me more seriously!",
    user: "John Doe",
    date: "Bought 10 months ago",
  },
  {
    id: 2,
    themTitle: "Bookify",
    themePrice: 28,
    img: sampleTheme2,
    quote:
      "Bookify completely transformed how we handle appointments. Clients love the seamless experience!",
    user: "Sophia Reyes",
    date: "Bought 3 months ago",
  },
  {
    id: 3,
    themTitle: "Gourmet Pro",
    themePrice: 35,
    img: sampleTheme3,
    quote:
      "Our restaurant’s website finally matches our high-end branding—reservations have doubled!",
    user: "Chef Marco Silva",
    date: "Bought 6 months ago",
  },
  {
    id: 4,
    themTitle: "LaunchHub",
    themePrice: 29,
    img: sampleTheme4,
    quote:
      "As a startup founder, I couldn’t ask for a better launch page. Sleek, responsive, and easy to customize.",
    user: "Aisha Khan",
    date: "Bought 2 months ago",
  },
  {
    id: 5,
    themTitle: "ShopNest",
    themePrice: 27,
    img: sampleTheme5,
    quote:
      "Setting up our clothing store was a breeze with ShopNest—it's stylish and super functional.",
    user: "Liam Tan",
    date: "Bought 5 months ago",
  },
];
