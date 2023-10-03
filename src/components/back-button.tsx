import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";

export const BackButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-2xl text-accent-secondary md:text-3xl"
    >
      <IoMdArrowBack />
    </button>
  );
};
