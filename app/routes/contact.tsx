"use client";

import { useState } from "react";

export default function Contact() {
  const profiles = [
    {
      id: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNS2jSzabh1icke_cALBwTS8NyesAYks4mLg&s",
      avatar:
        "https://i.pinimg.com/736x/ac/4a/71/ac4a71b64f03976b4f40265987718b03.jpg",
      name: "Fauzan Akmal",
      role: "Create Frontend and UI/UX",
      NIM: "24.61.0271",
    },

    {
      id: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqiqDGppFgzOfrMzopkDNjdsclotRQXKfuDw&s",
      avatar:
        "https://images.ctfassets.net/h6goo9gw1hh6/4uZMPT7pEQxvowHt980pXI/093596e039b95eb45570ff991a98a044/Tell_Me_More__Meme_Example.jpg?w=1080&h=1080&fl=progressive&q=70&fm=jpg",
      name: "Seno Aji",
      NIM: "24.61.0268",
      role: "Backend",
    },

    {
      id: 3,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFwz2zuPTXiO77uuOVBUTr9VFJLfjXLvBvA&s",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYQzjbW9Sz1HtRHmXU_lwCqFmeWMCTmtkfg&s",
      name: "Aditya Putra Widaswara",
      NIM: "24.61.0269",
      role: "Create Frontend and UI/UX",
    },
  ];

  const [activeProfile, setActiveProfile] = useState(profiles[0]);

  return (
    <section className="min-h-screen bg-[#f5f5f5] px-[5vw] py-[5vh] overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-[3vw] items-center lg:items-start">
        <div className="bg-white shadow-2xl rounded-full px-[1vw] py-[2vh] flex lg:flex-col gap-[2vh] items-center">
          {profiles.map((profile) => (
            <img
              key={profile.id}
              src={profile.avatar}
              alt={profile.name}
              onClick={() => setActiveProfile(profile)}
              className={`
                w-[14vw] h-[14vw]
                md:w-[8vw] md:h-[8vw]
                lg:w-[4vw] lg:h-[4vw]
                
                min-w-[50px]
                min-h-[55px]
                
                rounded-full
                object-cover
                cursor-pointer
                transition-all
                duration-500
                border-[0.25vw]

                ${
                  activeProfile.id === profile.id
                    ? "scale-110 border-[#004996] shadow-2xl"
                    : "border-white opacity-70 hover:opacity-100 hover:scale-105"
                }
              `}
            />
          ))}
        </div>
        <div className="flex-1 w-full">
          <div className="overflow-hidden rounded-[2vw] shadow-2xl">
            <img
              src={activeProfile.image}
              alt=""
              className="
                w-full
                h-[35vh]
                md:h-[45vh]
                lg:h-[55vh]
                object-cover
                transition-all
                duration-700
                hover:scale-105
              "
            />
          </div>
          <div className="mt-[4vh] text-center lg:text-left animate-fade">
            
            <p className="
              uppercase
              tracking-[0.7vw]
              text-[3vw]
              md:text-[1.5vw]
              lg:text-[0.9vw]
              text-gray-400
              font-semibold
            ">
              {activeProfile.role}
            </p>

            <h1 className="
              text-[10vw]
              md:text-[7vw]
              lg:text-[5vw]
              leading-none
              font-black
              text-gray-900
              mt-[1vh]
            ">
              {activeProfile.name}
            </h1>

            <h2 className="
              text-[4vw]
              md:text-[2vw]
              lg:text-[1.5vw]
              text-gray-500
              mt-[1vh]
            ">
              {activeProfile.NIM}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}