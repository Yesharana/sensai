"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";

const EditNote = () => {
  const router = useRouter();
  const { id } = useParams(); // ID from URL is a string
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !id || !user) return;
    
    const storageKey = `notes_${user.id}`;
    const savedNotes = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Convert both IDs to strings for comparison
    const noteToEdit = savedNotes.find((note) => String(note.id) === String(id));
    
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setError("");
    } else {
      setError("Note not found. It may have been deleted or you don't have permission to edit it.");
    }
    
    setLoading(false);
  }, [id, user]);

  const handleUpdateNote = () => {
    if (!user) {
      alert("You must be logged in to update notes!");
      return;
    }

    if (!title.trim()) {
      alert("Title cannot be empty!");
      return;
    }
    
    const storageKey = `notes_${user.id}`;
    const savedNotes = JSON.parse(localStorage.getItem(storageKey)) || [];
    const updatedNotes = savedNotes.map((note) =>
      String(note.id) === String(id) ? { ...note, title, content } : note
    );
    
    localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
    router.push("/notes/view");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white flex-col p-6">
        <Card className="w-full max-w-lg bg-zinc-900 border border-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={() => router.push("/notes/view")} className="w-full">
              Back to Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4">
      <Card className="flex-grow flex flex-col bg-zinc-900 border border-zinc-800 text-white">
        <CardHeader className="border-b border-zinc-800">
          <CardTitle className="text-2xl">Edit Note</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow p-0">
          <div className="p-4 border-b border-zinc-800">
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="bg-zinc-800 border-zinc-700 text-white text-lg"
              placeholder="Note Title"
            />
          </div>
          <div className="flex-grow p-4 flex flex-col">
            <Textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              className="flex-grow bg-zinc-800 border-zinc-700 text-white resize-none min-h-[300px]"
              placeholder="Note Content"
            />
          </div>
          <div className="flex p-4 border-t border-zinc-800 gap-4">
            <Button 
              onClick={() => router.push("/notes/view")} 
              variant="outline" 
              className="flex-1 border-zinc-700 hover:bg-zinc-800 text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateNote} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditNote;