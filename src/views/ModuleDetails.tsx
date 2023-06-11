import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
//import { useSelector } from "react-redux";
//import { RootState } from "../redux/store";

export const ModuleDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const moduleCode = params.moduleCode?.toUpperCase();

  useEffect(() => {
    fetch(`https://api.nusmods.com/v2/2022-2023/modules/${moduleCode}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        console.log(actualData);
        setData(actualData);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Module Details about {moduleCode}</h1>
      {loading && <div>A moment please...</div>}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <p>{JSON.stringify(data)}</p>
      {/*<h1>{useSelector((state: RootState) => state.moduleData)}</h1>*/}
    </div>
  );
};
