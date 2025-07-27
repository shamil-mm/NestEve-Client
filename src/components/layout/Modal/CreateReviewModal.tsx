import React, { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';
import { useAppSelector } from '../../../hooks/AuthHook';
import { editReviews, markReview } from '../../../services/EventServices';
import { IReview } from '../../../interfaces/Ireview';

interface ICreateReviewModalProps {
    close: (value: boolean) => void;
    eventId: string;
    newReview: (value: IReview,label:string) => void;
    label: string,
    existingReview?: Partial<IReview>;
}

const CreateReviewModal: React.FC<ICreateReviewModalProps> = ({ close, eventId, newReview, label, existingReview }) => {
    const userId = useAppSelector((state) => state.authUser?.user?.id)
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (label === 'edit' && existingReview) {
            setRating(existingReview.rating || 0);
            setReviewText(existingReview.review || '');
        }
    }, [label, existingReview]);

    const handleSubmit = async (label: string) => {
        if (rating === 0 || !reviewText.trim()) return;
        if (label === 'create') {
            setIsSubmitting(true);
            const res = await markReview(userId as string, eventId, rating, reviewText)
            const Review = res.response
            const responseReview = {
                _id: Review._id,
                eventId: { _id: Review.eventId._id, title: Review.eventId.title },
                userId: { _id: Review.userId._id, name: Review.userId.name },
                rating: Review.rating,
                review: Review.review,
                createdAt: Review.createdAt,
                updatedAt: Review.updatedAt
            }
            if (res) {
                newReview(responseReview,label)
            }
            

        }else{
           setIsSubmitting(true);
           const res = await editReviews(existingReview?._id as string, rating, reviewText)
           const Review = res.response
            const responseReview = {
                _id: Review._id,
                eventId: { _id: Review.eventId._id, title: Review.eventId.title },
                userId: { _id: Review.userId._id, name: Review.userId.name },
                rating: Review.rating,
                review: Review.review,
                createdAt: Review.createdAt,
                updatedAt: Review.updatedAt
            }
            if (res) {
                newReview(responseReview,label)
            }

            
        }
        setIsSubmitting(false);
            close(false);

    };


    return (
        <div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black border border-gray-700 rounded-lg shadow-lg w-full max-w-md">

                <div className="flex items-center justify-between p-6 border-blue-800/30">
                    <h2 className="text-2xl font-bold text-white">{label === "create" ? "Write a Review" : "Edit Review"}</h2>
                    <button
                        onClick={() => close(false)}
                        className="p-2 hover:bg-blue-800/20 rounded-full transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-gray-300 hover:text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-200">
                            Rating *
                        </label>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform duration-200 hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= (hoverRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-400 hover:text-yellow-400'
                                            } transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-3 text-sm text-gray-300">
                                    {rating} out of 5 stars
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-200">
                            Your Review *
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience with this event..."
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-blue-700/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                            required
                        />

                    </div>


                    <button
                        type="button"
                        onClick={() => handleSubmit(label)}
                        disabled={rating === 0 || !reviewText.trim() || isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-600 disabled:to-blue-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:hover:scale-100"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>

                                <span> {label === "create" ? "Submit Review" : "Edit Review"}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateReviewModal;