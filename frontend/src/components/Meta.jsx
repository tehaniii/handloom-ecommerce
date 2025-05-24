import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To ModernDeco',
  description: 'We sell the best products for cheap',
  keywords: 'Handlooms, buy Scarves, cheap Collectibles',
};

export default Meta;
