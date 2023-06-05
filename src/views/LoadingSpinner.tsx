import { Oval } from 'react-loader-spinner';

const LoadingSpinner = () => {
  return (
    <Oval
      width="16"
      height="16"
      color="black"
      secondaryColor="grey"
      ariaLabel="loading"
      strokeWidth="8"
    />
  );
};

export default LoadingSpinner;
