import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

interface CuisinesFormProps {
  cuisines: string[] | undefined;
  setCuisines: (cuisines: string[]) => void;
}

const CuisinesAddForm: React.FC<CuisinesFormProps> = ({
  cuisines,
  setCuisines,
}) => {
  const [newCuisine, setNewCuisine] = useState<string>("");
  const cuisineRef = useRef<HTMLDivElement>(null);

  const addCuisine = () => {
    if (newCuisine && !cuisines?.includes(newCuisine) && cuisines) {
      if (cuisineRef.current) {
        cuisineRef.current.scrollTop = cuisineRef.current.scrollHeight;
      }
      setCuisines([...cuisines, newCuisine]);
      setNewCuisine("");
    }
  };

  const deleteCuisine = (index: number) => {
    if (cuisines) {
      setCuisines(cuisines.filter((_, i) => i !== index));
    }
  };

  const oddCuisines = cuisines?.filter((_, index) => index % 2 === 0);
  const evenCuisines = cuisines?.filter((_, index) => index % 2 !== 0);

  return (
    <div className="flex  gap-4">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="eg: Italian"
          className="input input-bordered input-warning w-44 max-w-xs"
          name="cuisines"
          value={newCuisine}
          onChange={(e) => setNewCuisine(e.target.value)}
        />
        <Button variant="contained" style={{ height: 40 }} onClick={addCuisine}>
          Add
        </Button>
      </div>

      {cuisines && cuisines.length > 0 && (
        <div
          className="border border-orange-400 rounded-lg p-2 h-[130px] w-full  overflow-auto "
          ref={cuisineRef}
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 w-1/2">
                {oddCuisines?.map((cuisine, index) => (
                  <div key={index} className="flex items-center">
                    <span>{index * 2 + 1}. </span>
                    <span className="ml-2">
                      {cuisine.length > 8
                        ? cuisine.substring(0, 8) + "..."
                        : cuisine}
                    </span>
                    <IconButton
                      onClick={() => deleteCuisine(index * 2)}
                      aria-label="delete"
                      size="small"
                      style={{ marginLeft: 10 }}
                      className="cursor-pointer "
                    >
                      <DeleteIcon className="text-red-500" />
                    </IconButton>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1 w-1/2 ">
                {evenCuisines?.map((cuisine, index) => (
                  <div key={index} className="flex items-center">
                    <span>{index * 2 + 2}. </span>
                    <span className="ml-2">
                      {cuisine.length > 8
                        ? cuisine.substring(0, 8) + "..."
                        : cuisine}
                    </span>
                    <IconButton
                      onClick={() => deleteCuisine(index * 2 + 1)}
                      aria-label="delete"
                      size="small"
                      style={{ marginLeft: 10 }}
                      className="cursor-pointer"
                    >
                      <DeleteIcon className="text-red-500" />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuisinesAddForm;
