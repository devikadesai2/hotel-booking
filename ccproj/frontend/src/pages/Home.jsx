import React, { useEffect, useState } from 'react'
import api from '../api/client'
import { Link } from 'react-router-dom'

export default function Home(){
  const [hotels, setHotels] = useState([])
  const [q, setQ] = useState('')

  useEffect(()=>{
    api.get('/hotels')
      .then(r => {
        // defensive: normalize response to an array
        const data = r?.data
        if (Array.isArray(data)) {
          setHotels(data)
        } else if (data && Array.isArray(data.hotels)) {
          setHotels(data.hotels)
        } else {
          // unknown shape — log for debugging and fallback to empty array
          console.warn('Unexpected /hotels response shape:', data)
          setHotels([])
        }
      })
      .catch(err => {
        console.error('Failed to fetch hotels', err)
        setHotels([])
      })
  },[])

  const search = async ()=>{ 
    try {
      const res = await api.get('/hotels?q='+encodeURIComponent(q))
      const data = res?.data
      if (Array.isArray(data)) setHotels(data)
      else if (data && Array.isArray(data.hotels)) setHotels(data.hotels)
      else { console.warn('Unexpected search response', data); setHotels([]) }
    } catch(err) {
      console.error('Search error', err)
    }
  }

  return (
    <div>
      <div className='hero'>
        <h1 className='text-5xl font-bold'>Find your next stay</h1>
        <p className='mt-2'>Search low prices on hotels for your dream vacation...</p>
      </div>
      <div className='search-card flex gap-4 items-center mt-6'>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Search city or hotel' className='p-2 rounded flex-1' />
        <button onClick={search} className='btn btn-primary'>Search</button>
        <Link to='/add-hotel' className='btn btn-primary ml-2'>Add Hotel</Link>
      </div>

      <h2 className='mt-8 text-2xl font-semibold'>My Hotels</h2>
      <div className='grid gap-4 mt-4'>
        {Array.isArray(hotels) && hotels.length > 0 ? (
          hotels.map(h=>(
            <div key={h._id} className='hotel-card'>
              <div className='flex justify-between'>
                <div>
                  <Link to={'/hotels/'+h._id} className='text-xl font-bold'>{h.title}</Link>
                  <div className='text-sm text-gray-500'>{h.address}</div>
                </div>
                <div className='text-lg font-semibold'>₹{h.pricePerNight}</div>
              </div>
              <p className='mt-2 text-gray-700'>{h.description}</p>
            </div>
          ))
        ) : (
          <div className='text-gray-600'>No hotels found.</div>
        )}
      </div>
    </div>
  )
}
