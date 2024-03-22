import React from "react";
import { IoSearch } from "react-icons/io5";

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBox(props: Props) {
  return (
    <form onSubmit={props.onSubmit} className="flex items-center justify-center relative h-10 rounded-full border border-gray-700 ps-3">
      <input
        type="search"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search location"
        className="bg-transparent h-full focus:outline-none  placeholder:text-slate-500"
      />
      <button className="rounded-full bg-sky-500 text-white hover:bg-sky-600 whitespace-nowrap h-full px-4 py-[9px] focus:outline-none">
        <IoSearch className="text-2xl text-gray-200"/>
      </button>
    </form>
  );
}
