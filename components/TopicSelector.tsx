import React from 'react';
import type { NVRTopic } from '../types';

interface TopicSelectorProps {
    topics: NVRTopic[];
    selectedTopic: NVRTopic;
    onTopicChange: (topic: NVRTopic) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ topics, selectedTopic, onTopicChange }) => {
    return (
        <div>
            <label htmlFor="topic-select" className="block text-sm font-medium text-slate-300 mb-2">
                Choose a Question Topic
            </label>
            <select
                id="topic-select"
                value={selectedTopic.name}
                onChange={(e) => {
                    const newTopic = topics.find(t => t.name === e.target.value);
                    if (newTopic) {
                        onTopicChange(newTopic);
                    }
                }}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
                {topics.map((topic) => (
                    <option key={topic.name} value={topic.name}>
                        {topic.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TopicSelector;
