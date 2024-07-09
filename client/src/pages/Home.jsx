import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; 
import ListingItem from '../components/ListingItem'; // Replace with actual  to ListingItem component

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=3');
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=3');
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=3');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
    fetchRentListings();
    fetchSaleListings();
  }, []);

  return (
    <div>
      {/* Top Section */}
      <div className='flex flex-col gap-6 p-20 px-3 max-w-6xl mx-auto'>
        <h1 className='text-green-800 font-bold text-3xl lg:text-6xl'>
          Welcome to Your <span className='text-green-500'>Dream</span>
          <br /> Home Destination
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Discover the perfect home with Mirpurkhas Estate, where every property is crafted to match your lifestyle and aspirations.
          <br />Whether you're buying, selling, or investing, we provide expert guidance to make your real estate journey seamless and rewarding.
        </div>
        <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Your New Home Awaits
        </Link>
      </div>

      {/* Swiper Section */}
      <Swiper navigation>
        {offerListings && offerListings.length > 0 && 
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: "cover" }} className='h-[500px]'>
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>

      {/* Listing Results Section */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold
              text-green-600 pl-8'>Recent Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline pl-8' to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-8 pl-8'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold
              text-green-600 pl-8'>Recent places for Rent</h2>
              <Link className='text-sm text-blue-800 hover:underline pl-8' to={'/search?type=rent'}>
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-8 pl-8'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold
              text-green-600 pl-8'>Recent places for Sale</h2>
              <Link className='text-sm text-blue-800 hover:underline pl-8' to={'/search?type=sale'}>
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-8 pl-8'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
