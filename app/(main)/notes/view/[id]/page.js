"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const ViewNotePage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { id } = useParams(); // ID from URL (string)
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const storageKey = `notes_${user.id}`;
      const savedNotes = JSON.parse(localStorage.getItem(storageKey)) || [];
      console.log("🔍 Searching for Note ID:", id);
      console.log("📂 Saved Notes in Local Storage:", savedNotes);
      
      // Convert both IDs to strings for consistent comparison
      const foundNote = savedNotes.find((n) => String(n.id) === String(id));
      setNote(foundNote || null);
      setLoading(false);
    }
  }, [id, user]);

  if (!user) return <p className="text-center text-gray-500">Please log in to view your note.</p>;
  
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (!note) return (
    <div className="text-center text-gray-500 p-6">
      <p className="mb-4">Note not found.</p>
      <Button onClick={() => router.push("/notes/view")}>Back to Notes</Button>
    </div>
  );

  return (
    <div className="absolute top-0 left-0 w-full h-screen flex flex-col bg-black text-white">
      {/* Header Section */}
      <div className="p-4 flex justify-between items-center bg-zinc-900">
        <Button onClick={() => router.push("/notes/view")} variant="outline" className="border-zinc-700 text-white">
          Back
        </Button>
        <h1 className="text-xl font-bold">{note.title}</h1>
        <Button onClick={() => router.push(`/notes/edit/${note.id}`)} className="bg-blue-600 hover:bg-blue-700">
          Edit
        </Button>
      </div>

      {/* Full-Screen Text Area */}
      <div className="flex-1 p-4">
        <textarea
          className="w-full h-full p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-300 resize-none"
          value={note.content}
          readOnly
        />
      </div>
    </div>
  );
};

export default ViewNotePage;
