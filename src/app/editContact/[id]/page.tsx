import { notFound } from "next/navigation";
import MainEditContactPage from "../../../components/editContact/MainEditContactPage";

import {
  getAllContacts,
  getContactById,
} from "../../../services/contactServices";

// export const dynamic = "force-dynamic";
export const revalidate = 10;
export const fetchCache = "force-cache";

const EditContact = async ({ params: { id } }: { params: { id: number } }) => {
  const data = await getContactById(id);

  if (!data) {
    notFound()
    return;
  }

  return <MainEditContactPage data={data} />;
};

export const generateStaticParams = async () => {
  const data = await getAllContacts();

  return data.map((data) => ({
    id: data.id.toString(),
  }));
};

export default EditContact;
