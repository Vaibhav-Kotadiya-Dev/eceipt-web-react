import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { RefreshTokenIfNeed } from "aas/common/functions";

const useCustomMutation = (...options) => {
  const navigate = useNavigate();
  const mutation = useMutation(...options);

  if (mutation?.error?.response?.status === 401) {
    //如果401是token过期了，尝试使用refresh token去刷新token
    console.log('401')
    RefreshTokenIfNeed();
    navigate("../401")
  }

  if (mutation?.error?.response?.status === 403) {
    navigate("../403")
  }
  return mutation;
}

export default useCustomMutation;