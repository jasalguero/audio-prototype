import { Button, Label, Select, TextInput } from "flowbite-react";
import { type NextPage } from "next";
import { useState } from "react";
import { api } from "~/utils/api";
import { API_URLS } from "~/utils/consts";

const Students: NextPage = () => {
  const { data: teachers } = api.teachers.getAll.useQuery();
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name,
      teacherId,
    };

    const res = await fetch(API_URLS.STUDENTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    setIsLoading(false);
  };

  return (
    <>
      <h1> Students login</h1>

      <form className="flex flex-col gap-4" onSubmit={(e) => void submitForm(e)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Your name" />
          </div>
          <TextInput
            id="name"
            type="name"
            placeholder="Johnny Smith"
            required={true}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="teacher" value="Your name" />
          </div>
          <Select
            id="teacher"
            required={true}
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option>Select your teacher</option>
            {teachers?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" disabled={isLoading}>
          Ask for joining
        </Button>
      </form>
    </>
  );
};

export default Students;
