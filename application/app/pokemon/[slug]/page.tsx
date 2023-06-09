"use client";

import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import Icon from "components/Icon/Icon";
import TypeLabel from "components/TypeLabel/TypeLabel";
import { useThemeContext } from "context/theme";
import { useBgContext } from "context/bgContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPokemonById } from "services/getPokemon";
import { typeColors } from "types/type";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type PokemonType = {
  name: string;
  types: {
    type: {
      name: string;
    };
  }[];
  evolution: {
    name: string;
    id: number;
  }[];
  typesData: {
    from: {
      bg: string;
      text: string;
    };
  };
};

export default function Pokemon({ params }: { params: { slug: string } }) {
  const [pokemon, setPokemon] = useState<PokemonType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { darkMode } = useThemeContext();
  const { setBg } = useBgContext();

  const id = params.slug;
  const isShiny = id.includes("_s");

  const fetchPokemon = async () => {
    const poke = await getPokemonById(id);

    setPokemon(poke);
  };

  useEffect(() => {
    fetchPokemon().then(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (pokemon?.types?.[0]?.type?.name) {
      const color = typeColors[pokemon.types[0].type.name];
      setBg(color.bg);
    }
  }, [pokemon]);

  return (
    <main className="w-full p-16 bg-bgPrimary rounded-xl shadow-md text-dBlack">
      <div className="flex w-full gap-8">
        {loading ? (
          <div className="flex gap-4 h-[140px] items-center">
            <div className="h-full w-[140px] flex justify-center">
              <Skeleton
                circle
                height={140}
                width={140}
                containerClassName="avatar-skeleton"
              />
            </div>

            <div className="w-[200px] h-full flex flex-col gap-2">
              <Skeleton height={20} width={50} />
              <Skeleton height={30} width={200} />
              <Skeleton height={25} width={100} className="mt-8" />
            </div>
          </div>
        ) : (
          <>
            <Image
              src={`/pokemon/${id}.png`}
              alt={id}
              width={140}
              height={140}
            />
            <div>
              <h2 className="text-xl">#{id.replace(/[^\d]/g, "")}</h2>
              <h1 className="text-4xl capitalize">{`${isShiny ? "Shiny " : ""}${
                pokemon?.name
              }`}</h1>
              <div className="pt-8 flex gap-2">
                {pokemon?.types?.map((type) => {
                  const typeName = type.type.name;

                  return (
                    <Image
                      src={`/types/${typeName}.png`}
                      key={typeName}
                      width={30}
                      height={30}
                      alt={typeName}
                      title={typeName}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className={`h-0.5 my-16 w-full ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      ></div>
      <section>
        <h2 className="text-2xl">Evolutions:</h2>

        <div className="flex pt-10 flex-row w-full justify-between items-center gap-16 relative text-6xl">
          {loading
            ? [...Array(3)].map((item) => {
                return (
                  <div key={item} className="w-[100px] h-[125px] max-h-[125px]">
                    <Skeleton
                      circle
                      height={100}
                      width={100}
                      containerClassName="avatar-skeleton"
                    />
                    <div className="h-5 flex flex-col-reverse mt-5">
                      <Skeleton height={20} count={1} />
                    </div>
                  </div>
                );
              })
            : pokemon?.evolution?.map((evol, i: number) => {
                const formattedId = evol.id + (isShiny ? "_s" : "");
                return (
                  <div
                    key={"evol-" + formattedId}
                    className="flex items-center gap-24"
                  >
                    {i !== 0 && <Icon icon={ArrowLongRightIcon} />}
                    <Link
                      className={`relative z-10 flex-col flex items-center ${
                        id === formattedId ? "scale-125" : ""
                      }`}
                      href={`/pokemon/${formattedId}`}
                    >
                      <Image
                        src={`/pokemon/${formattedId}.png`}
                        key={evol.name}
                        width={80}
                        height={80}
                        alt={evol.name}
                        title={evol.name}
                      />
                      <div className="text-lg pt-4 text-center capitalize">
                        {evol.name}
                      </div>
                    </Link>
                  </div>
                );
              })}
        </div>
      </section>
      <div
        className={`h-0.5 my-16 w-full ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      ></div>
      <section>
        {/* <div>
          <h2 className='text-2xl'>Deals damage to:</h2>
          <div className='grid grid-cols-4 gap-4 pt-4'>
            {pokemon?.typesData?.to?.double ? Object.entries(pokemon.typesData.to.double).map((type: any) => <TypeLabel key={type[0]+type[1]} type={type[0]} multiplier={type[1]} />) : null}
            {pokemon?.typesData?.to?.half ? Object.entries(pokemon.typesData.to.half).map((type: any) => <TypeLabel key={type[0]+type[1]} type={type[0]} multiplier={type[1]} />) : null}
            {pokemon?.typesData?.to?.null ? Object.entries(pokemon.typesData.to.null).map((type: any) => <TypeLabel key={type[0]+type[1]} type={type[0]} multiplier={type[1]} />) : null}
          </div>
        </div> */}
        <div>
          <h2 className="text-2xl">Damage it takes from:</h2>
          <div className="grid grid-cols-3 gap-4 mt-16">
            {loading
              ? [...Array(6)].map((item) => {
                  return (
                    <div key={item} className="flex-1">
                      <Skeleton height={40} borderRadius="1.5rem" count={1} />
                    </div>
                  );
                })
              : pokemon?.typesData?.from
              ? Object.entries(pokemon.typesData.from)
                  //eslint-disable-next-line
                  .sort((a: any, b: any) => b[1] - a[1])
                  //eslint-disable-next-line
                  .map((type: any) => (
                    <TypeLabel
                      key={type[0] + type[1]}
                      className={"text-gray-500"}
                      type={type[0]}
                      multiplier={type[1]}
                    />
                  ))
              : null}
          </div>
        </div>
      </section>
    </main>
  );
}
