import React, { useEffect, useState } from "react";
import { dummyStoriesData } from "../assets/assets";
import { Plus } from "lucide-react";
import moment from "moment";
import StoryModel from "./StoryModel";
import StoryViewer from "./StoryViewer";

const Storiesbar = () => {
  const [stories, setStories] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [viewStory, setViewStory] = useState(null);

  const fetchStories = async () => {
    setStories(dummyStoriesData);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4">
      <div className="flex gap-4 pb-5">
        {/* stories card */}
        <div on onClick={(() => setShowModel(true) )} className="rounded-lg shadow-sm min-w-[120px] max-w-[120px] h-40 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white">
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-700">Create Story</p>
          </div>
        </div>

        {/*  stories bar */}
        {stories.map((story, index) => (
          <div
           onClick={() => setViewStory(story)}
            className="relative rounded-lg shadow min-w-[120px] max-w-[120px] h-40 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 "
            key={index}
          >
            <img
              src={story.user.profile_picture}
              alt=""
              className="absolute size-8 top-3 left-3 z-10 rounded-full ring-gray-100 shadow"
            />

            <p className="absolute top-16 left-3 text-white/60 text-sm truncate max-w-[96px]">
              {story.content}
            </p>

            

            {story.media_type !== "text" && (
        <div className="absolute inset-0 z-1 rounded-lg bg-black overflow-hidden">
          {story.media_type === "image" ? (
            <img
              src={story.media_url}
              alt="story"
              className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
            />
          ) : (
            <video
              src={story.media_url}
              className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
            />
          )}
        </div>
      )}

      <p className="text-white absolute bottom-1 right-2 z-10 text-xs">
              {moment(story.createdAt).fromNow()}
            </p>
            
          </div>
        ))}
      </div>
{/* add story model */}
       {showModel && (
        <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />
      )}

      {/* View Story */}
      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
 
    </div>
  )
}

export default Storiesbar
