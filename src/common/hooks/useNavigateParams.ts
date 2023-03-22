import { useNavigate } from 'react-router-dom';

const useNavigateParams = () => {
  const navigate = useNavigate();

  return (url: string, params: any) => navigate({
    pathname: url,
    search: params
  });
};

export default useNavigateParams;
