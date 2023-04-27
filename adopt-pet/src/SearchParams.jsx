import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import useBreedList from "./useBreedList";
import Results from "./Results";
import fetchSearch from "./fetchSearch";
import AdoptedPetContext from "./AdoptedPetContext";

const Animals = ["dog", "cat", "bird"];
const SearchParams = () => {
  const [adoptedPet] = useContext(AdoptedPetContext);

  const [requestParams, setRequestParams] = useState({
    animal: "",
    breed: "",
    location: "",
  });
  // const [location, setLocation] = useState("");
  const [animal, setAnimal] = useState("");
  // const [breed, setBreed] = useState("");
  const [, setPets] = useState([]);

  const [breeds] = useBreedList(animal);

  // useEffect(() => {
  //   requestPets();
  // }, []);

  // async function requestPets() {
  //   const res = await fetch(
  //     `https://pets-v2.dev-apis.com/pets?animal=${animal}&location=${location}&breed=${breed}`
  //   );
  //   const json = await res.json();
  //   setPets(json.pets);
  // }

  const results = useQuery(["search", requestParams], fetchSearch);

  const pets = results?.data?.pets ?? [];

  return (
    <div className="search-params">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const obj = {
            animal: formData.get("animal") ?? "",
            location: formData.get("location") ?? "",
            breed: formData.get("breed") ?? "",
          };
          setRequestParams(obj);
        }}
      >
        {adoptedPet ? (
          <div className="pet image-container">
            <img src={adoptedPet.images[0]} alt="adopted_pet_image" />
          </div>
        ) : null}
        <label htmlFor="location">
          Location
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Location"
          />
        </label>

        <label htmlFor="animal">
          Select Animal
          <select
            name="animal"
            id="animal"
            value={animal}
            onChange={(e) => setAnimal(e.target.value)}
          >
            <option />
            {Animals.map((animal) => (
              <option key={animal}>{animal}</option>
            ))}
          </select>
        </label>

        <label htmlFor="breed">
          Select Breed
          <select name="breed" disabled={breeds.length === 0} id="breed">
            <option />
            {breeds.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>

        <button>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
