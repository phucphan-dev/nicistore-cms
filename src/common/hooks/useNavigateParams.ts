import { generatePath, useNavigate } from 'react-router-dom';

const useNavigateParams = () => {
  const navigate = useNavigate();

  return (url: string, params: any) => {
    const path = generatePath(':url?:queryString', {
      url,
      queryString: params
    });
    navigate(path);
  };
};

export default useNavigateParams;
