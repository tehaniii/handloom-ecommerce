import { useEffect, useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Loader from '../components/Loader';
import aboutImage from '../assets/about-us.jpg'; // 👈 Place a branded image in /src/assets/
import aboutImage1 from '../assets/about-us1.jpg'; // 👈 Place a branded image in /src/assets/

const AboutScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      {/* 🔶 Full-Width Hero Image */}
      <div
        style={{
          backgroundImage: `url(${aboutImage1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
          width: '100%',
          marginBottom: '2rem',
          filter: 'brightness(0.8)',
        }}
      ></div>

      {/* 🔶 Main Content Card */}
      <Container>
        <Row className='justify-content-center'>
          <Col md={10}>
            <div
              className='p-5 shadow-lg rounded'
              style={{
                background: 'linear-gradient(to right, #fff8f0, #fffdf8)',
                border: '4px solid orange',
              }}
            >
              <Row className='align-items-center'>
                <Col md={6}>
                  <Image
                    src={aboutImage}
                    alt='Selyn Weaving'
                    fluid
                    rounded
                    className='mb-4 mb-md-0'
                    style={{
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    }}
                  />
                </Col>
                <Col md={6}>
                  <h2 className='mb-4' style={{ color: '#e6760d' }}>
                    Our Story
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    <strong>Selyn</strong> is Sri Lanka’s first and only fair-trade guaranteed
                    handloom brand. For over 30 years, we've empowered rural artisans — especially
                    women — to preserve tradition while creating beautiful, sustainable textiles.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    Our collections include <em>Sarongs, Scarves, Bed Linen, Cushion Covers</em>,
                    and more — each crafted with care, heritage, and heart.
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AboutScreen;
