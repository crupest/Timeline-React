import React from 'react';
import { Spinner } from 'reactstrap';

const LoadingPage: React.FC = () => {
  return (
    <div className="position-fixed w-100 h-100 d-flex justify-content-center align-items-center">
      <Spinner style={{ height: '2.5rem', width: '2.5rem' }} color="primary" />
    </div>
  );
};

export default LoadingPage;
