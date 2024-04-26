import React from 'react';
import { Card,CardFooter,
  CardBody} from '@nextui-org/react';
import james_img from "../assets/james.png";
import kaiwen_img from "../assets/kaiwen.png";
import ruiqi_img from "../assets/ruiqi.png";
import ryan_img from "../assets/ryan.jpg";
import yingqi_img from "../assets/yingqi.png";
import overview_img from "../assets/overview.png";


// Team members information
const teamMembers = [
  {
    name: "James Jiang",
    description: "I am a final year computer engineering student, with two research experiences in machine learning and related fields. I have taken several courses on machine learning and artificial intelligence, and also have done several projects on web and mobile developments. Personally, I enjoy playing badminton every week, and can also play piano and a bit of guitar.",
    image: james_img,
  },
  {
    name: "Kaiwen Deng",
    description: "I have some experience in machine and deep learning, specifically in reinforcement learning. This past summer, I did research with a professor in reinforcement learning. During the experience, I developed some fundamental skills in machine learning and deep learning and I think I will be able to contribute to the team effectively.",
    image: kaiwen_img, 
  },
  {
    name: "Ruiqi Tian",
    description: "I am a 4th year computer engineering student, with knowledge about machine and deep learning, especially in the field of computer vision. I have an experience of research in deep video understanding, and several project experience in backend and frontend development. In my leisure time, I love playing badminton and cycling.",
    image: ruiqi_img,
  },
  {
    name: "Ryan Clayton",
    description: "As a computer engineering student in my final year, I've gained experience in machine learning and data collection through my coursework. I have a love for all things outdoors, especially hiking, so I'm thrilled to be working on a project that could save lives in a space where I'm actively involved.",
    image: ryan_img,
  },
  {
    name: "Ying Qi Wen",
    description: "I have experience with deep learning, specifically computer vision, data cleaning, and convolutional neural networks.  I have done research in pure mathematics, and I am minoring in honors mathematics. I love astronomy and I play chess.",
    image: yingqi_img,
  },
];

// About us page component
export const About_us = () => {
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Horizontally centers the cards
    alignItems: 'stretch',
    margin: '-2.5px' // Negative margin can help to counteract the card margins
  };

  // Inline style for each card
  const cardStyle = {
    flex: '0 0 calc(15% - 20px)', // Adjust the 10px if there's margin/padding
    margin: '10px', // Spacing between cards
  };


  return (
    <div className="flex flex-col items-center justify-center py-20">
      <article>
        <section className="pb-20">
            <h1 className="text-center font-semibold text-6xl m-5">Product Overview</h1>
            <p className="px-80 text-xl text-justify">Our product will be a cloud-hosted machine learning service that the user interacts with via a desktop application. It will allow the user to upload drone footage, typically videos shot with drones, and will run a machine learning model on it to label the frames that potentially contain humans (such as lost hikers) or signs of human activities. The purpose of our product is to assist search and rescue teams in saving time by focusing on relevant video sections and providing them with clearly labeled and organized data for easy manual review.</p>
        </section>

        <section className="pb-20 justify-center">
            <h2 className="text-center font-semibold text-6xl m-5">Components</h2>
            <p className="px-80 text-xl text-justify">The product will mainly consist of four components: the dataset component, machine learning component, cloud component, and user component. The high-level architecture of our product is shown below in Figure 1.1.</p>
            <div className='flex px-80 justify-center'>
            <figure class="flex flex-col justify-center items-center h-auto w-[600px]">
                <img src={overview_img}/>
                <figcaption className="px-40 text-xl">Figure 1.1 Overall Design</figcaption>
            </figure></div>
        </section>

        <section className="pb-10">
            <h2 className="text-center font-semibold text-6xl m-5">Functionality</h2>
            <p className="px-80 text-xl text-justify">In the front-end, our users will have access to a desktop software to process drone footage. It will be mainly used to update footage, inspect and download processed footage with labeling. In the back-end, we will have our server hosted on AWS Cloud, along with the machine learning model trained with the Amazon service. The dataset component will be used exclusively during model training and testing.</p>
        </section>
      </article>
      <h1 className="text-center font-semibold text-6xl m-5">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 p-12">
        {teamMembers.map((member, index) => (
          <div key={index} style={cardStyle}>
          <Card isFooterBlurred={true} radius="lg" className="border-none">
            <CardBody className="object-cover">
              <img src={member.image} alt={member.name} className="inline-block p-2 rounded-lg shadow-lg" />
            </CardBody>
            <CardFooter css={{ justifyItems: "flex-start", gap: "10px" }}>
              <div>
                <strong style={{ fontSize: "18px" }}>{member.name}</strong>
                <p style={{ color: "#717171" }}>{member.description}</p>
              </div>
            </CardFooter>
          </Card>
        </div>
        ))}
      </div>
    </div>
  );
};



