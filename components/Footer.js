export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="max-w-6xl mx-auto px-6 py-6 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Sridhar Prakash. All rights reserved.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          This website is for public engagement and volunteer coordination.
        </p>
      </div>
    </footer>
  );
}
