'use client';

interface ErrorProps {
  error: Error & { digest?: string };
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="mb-2 text-lg font-semibold">
        Oops, something went wrong!
      </h1>
      <p>
        {error.message || 'The AI got rate limited, please try again later.'}
      </p>
      <p>Digest: {error.digest}</p>
    </div>
  );
}
