import React from 'react';
import { FaStar } from 'react-icons/fa';

const testimonial = [
  {
    id: 1,
    rating: 5,
    review: "Dr. Lapera was amazing with my anxious cat. She took the time to make him comfortable and provided excellent care. The virtual visit was so convenient!",
    petName: "Max the Golden Retriever",
    reviewer: "Sarah Mitchell",
    timeAgo: "39 minutes ago",
    petImage: "https://i.postimg.cc/SKkMGQy6/Frame-2147226503.png",
    reviewerImage: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    rating: 5,
    review: "I was skeptical about virtual vet visits, but Dr. Lapera was thorough and professional. She accurately diagnosed my dog's skin issue and the treatment worked perfectly.",
    petName: "Bella the Cat",
    reviewer: "James Wilson",
    timeAgo: "2 days ago",
    petImage: "https://i.postimg.cc/sgRKGZNT/Frame-2147226503-(1).png",
    reviewerImage: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    rating: 5,
    review: "The best veterinary experience we've had. The convenience of not having to take our anxious dog to the clinic made all the difference. Highly recommend!",
    petName: "Charlie the Pug",
    reviewer: "Emily Chen",
    timeAgo: "1 week ago",
    petImage: "https://i.postimg.cc/4dMQfKcc/Frame-2147226503-(2).png",
    reviewerImage: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const Testimonial = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-4">

        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-2">What Pet Owners Are Saying</h2>
          <p className="text-black">Real reviews from real pet parents</p>
        </div>

        {/* Testimonial Cards */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 mb-8">
          {testimonial.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex-1 flex flex-col"
              style={{ minHeight: '350px' }}
            >
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={`mr-1 ${i < item.rating ? 'text-emerald-500' : 'text-black'}`} 
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-black mb-6 flex-1">
                {item.review}
              </p>

              {/* Pet Info */}
              <div className="flex items-center mb-4">
                <img 
                  src={item.petImage} 
                  alt={item.petName} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-medium text-black">{item.petName}</p>
                </div>
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center mt-auto">
                <img 
                  src={item.reviewerImage} 
                  alt={item.reviewer} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-medium text-black">{item.reviewer}</p>
                  <p className="text-sm text-black">{item.timeAgo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See All Reviews */}
        <div className="text-center">
          <a href="#" className="text-black font-medium hover:underline">
            See all reviews
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
