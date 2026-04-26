import { getContent } from "@/actions/adminActions";
import KontaktClient from "@/components/contact/KontaktClient";

export default async function KontaktPage({ searchParams }) {
  // Ожидаем параметры поиска
  const params = await searchParams;
  const isEdit = params.edit === "true";

  // Загружаем данные из БД. Используем те же ключи, что и в KontaktClient
  const dbData = await getContent("kontakt", "informacie");

  // Обновленный объект по умолчанию с полями видимости (show_...)
  const defaultData = {
    firma: "BART Complex s.r.o.",
    show_firma: true,
    adresa: "Novojelčanská 845/63 925 23 Jelka",
    show_adresa: true,
    ico: "51921979",
    show_ico: true,
    dic: "2120839974",
    show_dic: true,
    icdph: "SK2120839974",
    show_icdph: true,
    tel: "0911 640 097",
    show_tel: true,
    email: "info@beton-plotysk.sk",
    show_email: true,
    map_link: "https://www.google.com/maps/embed?pb=...", // добавь актуальную ссылку
    show_map: true
  };

  return (
    <KontaktClient 
      editMode={isEdit} 
      initialData={dbData || defaultData} 
    />
  );
}