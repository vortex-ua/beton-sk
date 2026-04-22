import { getContent } from "@/actions/adminActions";
import KontaktClient from "@/components/contact/KontaktClient";

export default async function KontaktPage({ searchParams }) {
  // Проверяем, не зашел ли админ (например, /kontakt?edit=true)
  const isEdit = (await searchParams).edit === "true";

  // Загружаем данные из БД
  const dbData = await getContent("kontakt", "informacie");

  const defaultData = {
    firma: "BART Complex s.r.o.",
    adresa: "Novojelčanská 845/63 925 23 Jelka",
    ico: "51921979",
    dic: "2120839974",
    icdph: "SK2120839974",
    tel: "0911 640 097",
    email: "info@beton-plotysk.sk"
  };

  return (
    <KontaktClient 
      editMode={isEdit} 
      initialData={dbData || defaultData} 
    />
  );
}