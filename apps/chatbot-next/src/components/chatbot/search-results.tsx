'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@template/ui/avatar';
import { Button } from '@template/ui/button';
import { Card, CardContent } from '@template/ui/card';

export interface SearchResultsProps {
  results: { title: string; url: string; content: string }[];
}

export function SearchResults({ results }: SearchResultsProps) {
  // State to manage whether to display the results
  const [showAllResults, setShowAllResults] = useState(false);

  const handleViewMore = () => {
    setShowAllResults(true);
  };

  const displayedResults = showAllResults ? results : results.slice(0, 3);
  const additionalResultsCount = results.length > 3 ? results.length - 3 : 0;

  return (
    <div className="flex flex-wrap">
      {displayedResults.map((result: any, index: any) => (
        <div className="w-1/2 p-1 md:w-1/4" key={index}>
          <Link href={result.url} passHref target="_blank">
            <Card className="flex-1">
              <CardContent className="p-2">
                <p className="line-clamp-2 text-xs">{result.content}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <Avatar className="h-4 w-4">
                    <AvatarImage
                      src={`https://www.google.com/s2/favicons?domain=${
                        new URL(result.url).hostname
                      }`}
                      alt={result.author}
                    />
                    <AvatarFallback>
                      {new URL(result.url).hostname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="truncate text-xs opacity-60">
                    {new URL(result.url).hostname}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
      {!showAllResults && additionalResultsCount > 0 && (
        <div className="w-1/2 p-1 md:w-1/4">
          <Card className="flex h-full flex-1 items-center justify-center">
            <CardContent className="p-2">
              <Button
                variant="link"
                className="text-muted-foreground"
                onClick={handleViewMore}
              >
                View {additionalResultsCount} more
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}