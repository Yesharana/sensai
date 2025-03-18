"use client";

import { useState } from "react";
import { generateCourses } from "@/actions/generateCourses"; // Backend function
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");

    try {
      const generatedCourses = await generateCourses();
      setCourses(generatedCourses);
    } catch (err) {
      setError("Failed to generate courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
                AI-Generated Learning Courses
              </CardTitle>
              <CardDescription>Personalized courses based on your industry & skills</CardDescription>
            </div>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate Courses"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          {loading ? (
            <p className="text-muted-foreground">Generating courses...</p>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course, index) => (
                <Card key={index} className="p-4">
                  <CardHeader>
                    <CardTitle className="gradient-title text-xl">{course.title}</CardTitle>
                    <CardDescription>{course.platform}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                    <Button
                      className="mt-3 w-full"
                      onClick={() => window.open(course.link, "_blank")}
                    >
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Click "Generate Courses" to get personalized recommendations.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
