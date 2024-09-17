"use client";
import React, {useEffect, useRef} from 'react';
import {algoliasearch} from 'algoliasearch';
import {autocomplete, getAlgoliaResults} from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';
import {Item} from "@/interfaces";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY;
const searchClient = algoliasearch(appId, apiKey);

const AlgoliaSearch = ({setInventory}: {
    setInventory: React.Dispatch<React.SetStateAction<Item[]>>}) => {
    const containerRef = useRef(null); // Use ref to target the container
    const initialized = useRef(false); // To track if autocomplete has been initialized

    useEffect(() => {
        if (containerRef.current && !initialized.current) {
            autocomplete({
                container: containerRef.current,
                placeholder: 'Search...',
                openOnFocus: true,

                getSources: ({query}) => [
                    {
                        onSelect({item}: { item: Item }) {
                            setInventory([item]);
                        },
                        sourceId: 'inventory',
                        getItems() {
                            return getAlgoliaResults({
                                searchClient: searchClient,
                                queries: [{indexName: 'Algolia_Index', query, params: {hitsPerPage: 5}}]
                            })
                        },
                        templates: {
                            item({item, html}) {
                                return html`
                                    <div class="flex flex-row gap-5 items-center">
                                        <div>
                                            <img src="${item.thumbnail}" alt="thumbnail"
                                                 class="w-12 h-16 rounded bg-cover"/>
                                        </div>
                                        <div>
                                            <h3 class="font-semibold capitalize text-lg">${item.name}</h3>
                                            <p class="text-xs uppercase text-slate-500">${item.itemId}</p>
                                            <p class="text-xs uppercase font-medium">Rs. ${item.sellingPrice}</p>
                                        </div>
                                    </div>`;
                            },
                            noResults() {
                                return 'No results';
                            }
                        }
                    }
                ]
                // Add other configurations here
            });
            initialized.current = true; // Set the flag to prevent re-initialization
        }
    }, []); // Empty dependency array to run once on mount

    return (
        <div ref={containerRef} className="relative w-full md:w-[15rem]"></div>
    );
};

export default AlgoliaSearch;
