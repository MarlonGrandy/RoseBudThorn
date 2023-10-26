import React from 'react';
import phoneImage from './images/phoneImage.png';

function About() {
  return (
    <div style={{ backgroundColor: '#fdfef5', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem 4rem' }}>

      {/* Navigation Links */}
      <div style={{ maxWidth: '960px', alignSelf: 'stretch', marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <a href="/" style={{ marginRight: '1.5rem', textDecoration: 'none', color: '#2c2c2c', fontWeight: 'bold', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#6b6b6b'} onMouseLeave={(e) => e.target.style.color = '#2c2c2c'}>Home</a>
          <a href="/about" style={{ textDecoration: 'none', color: '#6b6b6b' }}>About</a>
      </div>

      {/* Content Section */}
      <div style={{ maxWidth: '960px', alignSelf: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Text Section */}
        <div style={{ flex: 1, paddingRight: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontFamily: 'sans-serif', fontSize: '2rem', fontWeight: 'bold', color: '#2c2c2c' }}>
            The Rose, Bud, Thorn Text Message Bot!
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b6b6b', marginBottom: '1rem', lineHeight: '1.5' }}>
            RoseBudThorn brings a fresh approach to reflection with the Rose, Bud, Thorn text bot. Just as a garden has blooming roses, budding flowers, and thorny challenges, our lives are full of highs, potentials, and lows. With this weekly summary feature, celebrate your 'Roses' (achievements), nurture your 'Buds' (opportunities), and address the 'Thorns' (challenges). A vibrant dashboard of your emotional and motivational garden awaits you!
          </p>
          <p style={{ fontSize: '1rem', color: '#6b6b6b', marginBottom: '1rem', lineHeight: '1.5' }}>
            We understand that motivation isn't just about moving forward but reflecting on the journey. Our unique Rose, Bud, Thorn textbot ensures you cherish every part of it.
          </p>
          <p style={{ fontSize: '1rem', color: '#6b6b6b', marginBottom: '1rem', lineHeight: '1.5' }}>
            Are you ready to nurture your personal garden and watch your potential bloom? Begin your journey with RoseBudThorn and cultivate success, one reflection at a time.
          </p>
        </div>

        {/* Image Section */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img src={phoneImage} alt="Phone showcasing RoseBudThorn features" style={{ maxWidth: '100%', borderRadius: '20px' }}/>
        </div>

      </div>
    </div>
  );
}

export default About;
