import { useState, useEffect } from 'react';
import { reviewsApi } from '@/lib/api';
import { mapBackendReviewsToFrontend, mapBackendReviewToFrontend } from '@/lib/review-mapper';
import { ReviewWithMetrics, ReviewMetrics } from '@/types/review-extended';

export function useReviews() {
  const [reviews, setReviews] = useState<ReviewWithMetrics[]>([]);
  const [allReviews, setAllReviews] = useState<ReviewWithMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ReviewMetrics>({
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    spamReviews: 0,
    avgRating: 0,
    highRiskReviews: 0,
    flaggedReviews: 0,
    topProducts: [],
  });

  /**
   * Calcule les métriques basées sur les revues
   */
  useEffect(() => {
    if (allReviews.length === 0) {
      setMetrics({
        totalReviews: 0,
        pendingReviews: 0,
        approvedReviews: 0,
        rejectedReviews: 0,
        spamReviews: 0,
        avgRating: 0,
        highRiskReviews: 0,
        flaggedReviews: 0,
        topProducts: [],
      });
      return;
    }

    const pendingCount = allReviews.filter((r) => r.status === 'pending').length;
    const approvedCount = allReviews.filter((r) => r.status === 'approved').length;
    const rejectedCount = allReviews.filter((r) => r.status === 'rejected').length;
    const spamCount = allReviews.filter((r) => r.status === 'spam').length;
    const highRiskCount = allReviews.filter((r) => r.riskLevel === 'high').length;
    const flaggedCount = allReviews.filter((r) => r.flagged).length;

    // Calcul de la moyenne des ratings
    const avgRating =
      allReviews.length > 0
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
        : 0;

    // Produits les plus revus
    const productCounts: Record<string, number> = {};
    allReviews.forEach((r) => {
      productCounts[r.productId] = (productCounts[r.productId] || 0) + 1;
    });
    const topProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productId]) => productId);

    setMetrics({
      totalReviews: allReviews.length,
      pendingReviews: pendingCount,
      approvedReviews: approvedCount,
      rejectedReviews: rejectedCount,
      spamReviews: spamCount,
      avgRating: parseFloat(avgRating as any),
      highRiskReviews: highRiskCount,
      flaggedReviews: flaggedCount,
      topProducts,
    });
  }, [allReviews]);

  /**
   * Récupère toutes les revues
   */
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const backendReviews = await reviewsApi.getAll();
      const transformedReviews = mapBackendReviewsToFrontend(backendReviews);
      setAllReviews(transformedReviews);
      setReviews(transformedReviews);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des revues';
      setError(message);
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Récupère les revues d'un produit spécifique
   */
  const getReviewsByProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const backendReviews = await reviewsApi.getByProduct(productId);
      const transformedReviews = mapBackendReviewsToFrontend(backendReviews);
      setReviews(transformedReviews);
      return transformedReviews;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des revues';
      setError(message);
      console.error('Error fetching product reviews:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Récupère les revues d'une boutique spécifique
   */
  const getReviewsByStore = async (storeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const backendReviews = await reviewsApi.getByStore(storeId);
      const transformedReviews = mapBackendReviewsToFrontend(backendReviews);
      setReviews(transformedReviews);
      return transformedReviews;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des revues';
      setError(message);
      console.error('Error fetching store reviews:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Récupère les revues d'un utilisateur spécifique
   */
  const getReviewsByUser = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const backendReviews = await reviewsApi.getByUser(userId);
      const transformedReviews = mapBackendReviewsToFrontend(backendReviews);
      setReviews(transformedReviews);
      return transformedReviews;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des revues';
      setError(message);
      console.error('Error fetching user reviews:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Récupère les revues avec un statut spécifique
   */
  const getReviewsByStatus = async (status: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const backendReviews = await reviewsApi.getByStatus(status);
      const transformedReviews = mapBackendReviewsToFrontend(backendReviews);
      setReviews(transformedReviews);
      return transformedReviews;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des revues';
      setError(message);
      console.error('Error fetching reviews by status:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Recherche des revues
   */
  const searchReviews = async (query: string) => {
    if (!query) {
      setReviews(allReviews);
      return allReviews;
    }

    try {
      setIsLoading(true);
      setError(null);
      const backendReviews = await reviewsApi.search(query);
      const transformedReviews = mapBackendReviewsToFrontend(backendReviews);
      setReviews(transformedReviews);
      return transformedReviews;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      setError(message);
      console.error('Error searching reviews:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Crée une nouvelle revue
   */
  const createReview = async (reviewData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const backendReview = await reviewsApi.create(reviewData);
      const transformedReview = mapBackendReviewToFrontend(backendReview);
      setAllReviews([transformedReview, ...allReviews]);
      setReviews([transformedReview, ...reviews]);
      return transformedReview;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(message);
      console.error('Error creating review:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Met à jour une revue
   */
  const updateReview = async (reviewId: string, reviewData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const backendReview = await reviewsApi.update(reviewId, reviewData);
      const transformedReview = mapBackendReviewToFrontend(backendReview);
      setAllReviews(
        allReviews.map((r) => (r.id === reviewId ? transformedReview : r))
      );
      setReviews(
        reviews.map((r) => (r.id === reviewId ? transformedReview : r))
      );
      return transformedReview;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(message);
      console.error('Error updating review:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Modère une revue (change son statut)
   */
  const moderateReview = async (reviewId: string, moderationData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const backendReview = await reviewsApi.moderate(reviewId, moderationData);
      const transformedReview = mapBackendReviewToFrontend(backendReview);
      setAllReviews(
        allReviews.map((r) => (r.id === reviewId ? transformedReview : r))
      );
      setReviews(
        reviews.map((r) => (r.id === reviewId ? transformedReview : r))
      );
      return transformedReview;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la modération';
      setError(message);
      console.error('Error moderating review:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signale une revue
   */
  const flagReview = async (reviewId: string, flagData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const backendReview = await reviewsApi.flag(reviewId, flagData);
      const transformedReview = mapBackendReviewToFrontend(backendReview);
      setAllReviews(
        allReviews.map((r) => (r.id === reviewId ? transformedReview : r))
      );
      setReviews(
        reviews.map((r) => (r.id === reviewId ? transformedReview : r))
      );
      return transformedReview;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du signalement';
      setError(message);
      console.error('Error flagging review:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Marque une revue comme utile/inutile
   */
  const markHelpful = async (reviewId: string, action: 'helpful' | 'unhelpful') => {
    try {
      setIsLoading(true);
      setError(null);
      const backendReview = await reviewsApi.markHelpful(reviewId, action);
      const transformedReview = mapBackendReviewToFrontend(backendReview);
      setAllReviews(
        allReviews.map((r) => (r.id === reviewId ? transformedReview : r))
      );
      setReviews(
        reviews.map((r) => (r.id === reviewId ? transformedReview : r))
      );
      return transformedReview;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement';
      setError(message);
      console.error('Error marking helpful:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Supprime une revue
   */
  const deleteReview = async (reviewId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await reviewsApi.delete(reviewId);
      setAllReviews(allReviews.filter((r) => r.id !== reviewId));
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(message);
      console.error('Error deleting review:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reviews,
    allReviews,
    isLoading,
    error,
    metrics,
    fetchReviews,
    getReviewsByProduct,
    getReviewsByStore,
    getReviewsByUser,
    getReviewsByStatus,
    searchReviews,
    createReview,
    updateReview,
    moderateReview,
    flagReview,
    markHelpful,
    deleteReview,
  };
}
