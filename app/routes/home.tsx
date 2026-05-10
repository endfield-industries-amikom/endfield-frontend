import { NavLink } from "react-router";
import "tailwindcss";

export default function Home() {
return <div className="outline-red">
        <div>
            <img src="https://static0.dualshockersimages.com/wordpress/wp-content/uploads/2025/11/arknights-endfield-dualshockers-preview-screenshots.jpg" alt="" className="w-full"/>
        </div>

    {/* What We Do */}
        <div className="z-10 bg-[#F8F546] gap-[13vw] flex grid-cols-2 ">
            <div className="bg-white p-[3vw] text-left text-[5vw] mb-[7vw] gap-[4vh] flex flex-col">
                <div>
                    <h2 className="text-[3vw] sm:text-[2.5vw] md:text-[3vw] lg:text-[3vw] font-bold mb-[1vh] text-[#202020]">
                        What We Do
                    </h2>
                    <p className="text-[3vw] md:text-[1.5vw] lg:text-[1vw] text-[#202020]">
                        We are a leading company in the industry, providing top-notch solutions and services to our clients.
                    </p>
                    <NavLink to="/about">
                        <button className="px-[6vw] py-[1.5vh] bg-[#202020] text-white text-[3vw] md:text-[1.5vw] lg:text-[1vw] rounded-xl hover:bg-[#F8F546] hover:text-[#202020] hover:font-bold cursor-pointer transition">
                        Learn More
                        </button>
                    </NavLink>
                </div>

                <div className="gap-[3vw] flex flex-col">
                    <div className="border-2 p-[2vw] border-[#D9D9D9] flex justify-evenly items-top gap-[2vw]">
                        <div className="bg-[#D9D9D9] w-[10vw] aspect-square"></div>
                        <div>
                            <h3 className="text-[2vw] md:text-[1.5vw] lg:text-[1vw] font-bold text-[#202020]">
                                Our Services
                            </h3>
                            <p className="text-[2vw] md:text-[1.5vw] lg:text-[1vw] text-[#202020]">
                               Our services include cutting-edge technology solutions tailored for you.
                            </p>
                        </div>
                    </div>
                    <div className="border-2 p-[2vw] border-[#D9D9D9] flex justify-evenly items-top gap-[2vw]">
                        <div className="bg-[#D9D9D9] w-[10vw] aspect-square"></div>
                        <div>
                            <h3 className="text-[2vw] md:text-[1.5vw] lg:text-[1vw] font-bold text-[#202020]">
                                Why Choose Us?
                            </h3>
                            <p className="text-[2vw] md:text-[1.5vw] lg:text-[1vw] text-[#202020]">
                               We combine experience, professionalism, and reliability.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-auto p-[2vw_0vw_0vw_0vw] gap-[2vw] mb-[5vh] flex flex-col bg-white">
                <div className="-translate-x-[7vw]">
                    <img src="https://static0.thegamerimages.com/wordpress/wp-content/uploads/wm/2026/01/arknights-endfield-placing-the-pac-structure.jpg?w=1600&h=900&fit=crop" alt="" className="rounded-xl w-full"/>
                </div>
                <div className="-translate-x-[7vw]">
                    <img src="https://blog-uploads.eneba.games/uploads/2026/01/ARKNIGHT-HUB-768x430.jpg" alt="" className="rounded-xl w-full"/>
                </div>
            </div>
        </div>

        <div className="gap-[0vw] flex flex-col items-center">
            <div className="text-center p-[0.5vw]">
                <h1 className="text-[5vw] md:text-[3vw] lg:text-[2vw] font-bold text-[#202020] tracking-wider">
                    New Information
                </h1>
            </div>
            <div className="w-full h-auto flex flex-col">
                <div className="">
                    <img src="https://images3.alphacoders.com/140/thumb-1920-1405039.jpg" alt="" className="h-[20vw] w-full object-cover"/>
                </div>
                <div className="flex grid-cols-3 gap-[2vw] mt-[3vh] justify-center">
                    <div>
                        <img src="https://i0.wp.com/news.qoo-app.com/en/wp-content/uploads/sites/3/2022/03/03_HD.554121.jpg?resize=900%2C506&ssl=1" alt="" className="h-[17vw] w-full object-contain rounded-3xl"/>
                    </div>
                    <div>
                        <img src="https://pbs.twimg.com/media/GmIh4WvbcAQeRiM.jpg" alt="" className="h-[17vw] w-full object-contain rounded-3xl"/>
                    </div>
                    <div>
                        <img src="https://s1.zerochan.net/Arknights%3A.Endfield.600.4273863.jpg" alt="" className="h-[17vw] w-full object-contain rounded-3xl"/>
                    </div>
                </div>
            </div>
            <div className="pt-[3vw]">
                <button className="px-[10vw] py-[2vh] bg-[#202020] text-white text-[3vw] md:text-[1.5vw] lg:text-[1vw] rounded-xl hover:bg-[#F8F546] hover:text-[#202020] hover:font-bold transition cursor-pointer">
                More Information
                </button>
            </div>
        </div>

        <div className="bg-[#202020] p-[2.5vw] mt-[5vh] text-center"></div>
        <div>
            <div className="p-[4vw] flex flex-col items-start">
                <h3 className="text-[5vw] md:text-[2.5vw] lg:text-[1vw] font-bold text-[#202020]">Our Product</h3>
                <p className="text-[1.5vw] md:text-[1.50vw] lg:text-[1vw] text-[#202020]">
                   Discover our range of innovative products.
                </p>
            </div>

            <div className="w-full h-[20vw] gap-[2vw] mb-[5vh] flex flex-row justify-center">
                <div className="border-[0.3vw] border-[#C2C2C2] bg-[#CFCFCF] w-[20vw] h-[25vw] rounded-xl flex flex-col gap-[2vw] justify-start overflow-hidden">
                   <div className="flex justify-center items-center h-[2vw] w-[8vw] rounded-br-md  overflow-hidden bg-[#C2C2C2]"> 
                        <p className="text-[0.8vw] font-medium text-[#202020]">Best Seller</p>
                   </div>
                   <div className="flex justify-center items-center h-[15vw]">
                        <h2 className="text-[1.2vw] md:text-[0.8vw] lg:text-[1.5vw]  text-[#202020]">
                            Product 1
                        </h2>
                   </div>
                   <div>

                   </div>
                   <div className="text-center"></div>
                   <div className="text-center"></div>
                   <div className="text-center"></div>
                </div>
            </div>

            <div>
                <button></button>
            </div>
        </div>
</div>
}
