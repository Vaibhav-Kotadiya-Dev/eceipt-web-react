
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { RefreshTokenIfNeed } from "aas/common/functions";

const useCustomQuery = (...options) => {
  const navigate = useNavigate();
  const query = useQuery(...options);

  // console.log(query)
  if (query?.error?.response?.status === 401) {
    //如果401是token过期了，尝试使用refresh token去刷新token
    RefreshTokenIfNeed();
    navigate("../401")
  }

  if (query?.error?.response?.status === 403) {
    navigate("../403")
  }
  return query;
}

export default useCustomQuery;