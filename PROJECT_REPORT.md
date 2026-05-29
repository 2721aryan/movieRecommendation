
# NFLIX — Movie Recommendation System
### Project Report

---

## Table of Contents

| S.No. | Topic | Page |
|-------|-------|------|
| 1. | Problem Domain Description | — |
| 2. | Literature Survey | — |
| 3. | Major Objective & Scope of Project | — |
| 4. | Problem Analysis and Requirement Specification | — |
| 5. | Detailed Design (Modeling and ERD/DFD) | — |
| 6. | Hardware/Software Platform Environment | — |
| 7. | Snapshots of Input & Output | — |
| 8. | Coding | — |
| 9. | Project Limitation and Future Scope | — |
| 10. | References | — |

---

---

# 1. Problem Domain Description

## 1.1 Introduction

The rapid proliferation of digital media in the 21st century has fundamentally transformed the way audiences around the world discover, access, and consume entertainment content. Where once a viewer's choices were limited to a handful of television channels or a local video rental store stocking a few hundred titles, modern streaming platforms have collapsed those constraints entirely. Today, services such as Netflix, Amazon Prime Video, Disney+, HBO Max, and Apple TV+ collectively host catalogues numbering in the tens of thousands of films and television programmes. This extraordinary abundance, while a remarkable achievement from a content perspective, has introduced a paradoxical usability problem that software engineers, data scientists, and information architects have been working to solve for over two decades: the **problem of choice**.

When a user opens a streaming application with no clear intent and is immediately confronted with fifteen thousand options, decision fatigue sets in rapidly. Research in behavioural economics, most notably Barry Schwartz's landmark 2004 work "The Paradox of Choice: Why More Is Less," demonstrates that beyond a certain threshold, increasing the number of options available to a consumer does not improve satisfaction — it reduces it. Users become overwhelmed, default to the familiar, and often abandon the decision-making process entirely, choosing to watch nothing despite having access to everything.

This is not a theoretical concern for streaming platforms. Netflix has publicly disclosed through investor relations materials and published research that the average Netflix subscriber spends approximately 90 seconds browsing before either making a selection or abandoning the session entirely. The platform estimates that without an effective recommendation system, subscribers would cancel their membership within three months — not because of a lack of content, but because of an inability to efficiently discover content they would personally enjoy.

NFLIX is a full-stack web application developed to address this problem in a controlled, demonstrable, and academically grounded context. The system provides a Netflix-inspired movie browsing and recommendation platform that combines real movie data sourced from The Movie Database (TMDB) API with a phased recommendation engine built on genre-weighted heuristics with architectural provisions for content-based filtering and collaborative filtering. The project demonstrates the complete software engineering lifecycle of a recommendation system — from data ingestion and persistence to API design, frontend development, user interaction tracking, and personalised result delivery.

## 1.2 Background and Motivation

### 1.2.1 Historical Context

The concept of automated recommendation systems predates the streaming era significantly. The earliest digital recommendation systems were developed in the 1990s in the context of email filtering and early online communities. The Tapestry system developed at Xerox PARC in 1992 is widely considered the first collaborative filtering system, allowing users to annotate and filter documents based on their own and others' reactions.

The field accelerated dramatically with the rise of e-commerce. Amazon's deployment of item-based collaborative filtering in the late 1990s — described in the seminal 2003 paper by Linden, Smith, and York — demonstrated that automated recommendations could drive measurable business value. Amazon reported that recommendations contributed between 10% and 35% of total revenue, depending on the product category.

The recommendation problem came into sharp public focus with the Netflix Prize competition, launched in 2006. Netflix released a dataset of 100 million anonymised movie ratings from 480,000 subscribers and offered a $1,000,000 prize to any team that could improve upon their existing recommendation algorithm (Cinematch) by 10%. The winning team, BellKor's Pragmatic Chaos, achieved an improvement of 10.06% using a sophisticated ensemble of matrix factorisation techniques, ultimately published in 2009. This competition produced a decade's worth of foundational research in the recommendation systems field and established matrix factorisation as the dominant technique.

### 1.2.2 Industry Scale

To appreciate the scale of the recommendation problem in the modern era, consider the following industry data points:

- Netflix serves over **238 million subscribers** across 190 countries. Over **80% of content streamed** on the platform is discovered through recommendations rather than direct search.
- YouTube's recommendation algorithm drives over **70% of watch time** on the platform, equating to hundreds of millions of hours per day.
- Spotify generates approximately **31%** of all streams from its algorithmically curated "Discover Weekly" playlist.
- Amazon attributes approximately **35%** of total revenue to its recommendation engine.

These figures underscore that recommendation systems are not a convenience feature — they are a core product capability that directly determines engagement, retention, and revenue.

### 1.2.3 Motivation for This Project

The academic and industry literature on recommendation systems is extensive, but there is a notable gap at the level of practical, full-stack implementations that are accessible to students and early practitioners. Most academic demonstrations use static, pre-processed datasets (such as the MovieLens 100K or 1M datasets) and produce offline evaluation metrics without ever building a user interface or a live data pipeline. Commercial systems, conversely, are production-grade but entirely proprietary.

NFLIX was motivated by the desire to bridge this gap — to build a system that is academically grounded (implementing and explaining the theoretical underpinnings of recommendation algorithms), practically functional (built on a real database with live TMDB data and a genuine user interface), and architecturally honest (openly acknowledging the phase-gated maturity of the recommendation engine).

## 1.3 Problem Statement

The problem addressed by this project can be formally stated as follows:

> *Given a catalogue of thousands of movies with rich metadata (genres, cast, director, keywords, ratings), and a user with an evolving history of interactions (likes, dislikes, watchlist additions), design and implement a system that can present the user with a ranked, personalised, and contextually relevant subset of the catalogue that maximises the probability of the user discovering a film they will enjoy.*

This problem decomposes into four sub-problems:

**Sub-problem 1 — Data Acquisition and Management:** How do we collect, store, and maintain an up-to-date catalogue of movie metadata that is rich enough to support content-based filtering?

**Sub-problem 2 — User Modelling:** How do we represent a user's tastes in a form that the system can compute with? Explicit ratings (likes/dislikes) and implicit signals (clicks, watchlist additions) must be captured, stored, and interpreted.

**Sub-problem 3 — Relevance Computation:** Given a user model and a movie catalogue, how do we efficiently compute a personalised relevance score for each movie and rank the catalogue accordingly?

**Sub-problem 4 — Cold Start:** How do we provide useful recommendations to new users who have no interaction history, and how gracefully does the system improve as that history grows?

## 1.4 Domain Terminology

| Term | Definition |
|------|-----------|
| Collaborative Filtering (CF) | Recommending items based on the behaviour patterns of similar users |
| Content-Based Filtering (CBF) | Recommending items similar to ones a user has previously engaged with, based on item attributes |
| Hybrid Recommendation | A system combining two or more recommendation techniques |
| Implicit Feedback | User signals inferred from behaviour (clicks, watch time, watchlist additions) |
| Explicit Feedback | Direct user ratings (likes, dislikes, star ratings) |
| Cold Start Problem | The inability to personalise recommendations for new users or newly added items |
| TF-IDF | Term Frequency–Inverse Document Frequency; a text vectorisation technique used in CBF |
| Cosine Similarity | A metric for measuring the angle between two vectors; used to compute movie similarity |
| Matrix Factorisation | A CF technique that decomposes a user-item rating matrix into latent factor matrices |
| Latent Factor | A hidden variable capturing an underlying user preference or item attribute (e.g., "preference for dark thrillers") |
| Precision@K | The fraction of the top-K recommendations that are truly relevant to the user |
| Recall@K | The fraction of all truly relevant items that appear in the top-K recommendations |
| TMDB | The Movie Database — an open-access movie metadata API |
| JWT | JSON Web Token — a compact, self-contained method for representing authentication claims |
| ORM | Object-Relational Mapper — translates database rows to in-memory objects |
| REST API | Representational State Transfer Application Programming Interface |

## 1.5 Proposed Solution Overview

NFLIX addresses the stated problem through a carefully designed, phased architecture:

**Data Layer:** A PostgreSQL relational database stores a locally cached copy of approximately 600–1000 movies sourced from TMDB, with full metadata including genres, cast, director, thematic keywords, vote averages, vote counts, runtime, maturity rating, and YouTube trailer keys. This local cache provides fast, reliable, API-independent access during recommendation computation.

**Data Pipeline:** An automated Python ingestion script (`ingest_tmdb.py`) fetches movie data from TMDB's popular, top-rated, and trending endpoints, enriches each record with credits and keyword data, and upserts the results into the local database. The script is designed to be run periodically to keep the catalogue current.

**Backend API:** A FastAPI application exposes five router groups covering authentication, movie listing and search, recommendation delivery, interaction logging, and user/watchlist management. The API is self-documenting via automatically generated Swagger UI.

**Authentication:** A stateless JWT-based authentication system with bcrypt password hashing. Users can register, log in, and create multiple viewer profiles under a single account.

**Recommendation Engine (Phase 1 — Current):**
- Trending: Ranked by `vote_average × log(vote_count + 1)`
- Top Rated: Sorted by `vote_average` with a vote count threshold
- For You: Genre-weighted scoring based on liked movies
- Similar Movies: Genre overlap scoring

**Recommendation Engine (Phase 2 — Scaffolded):**
- Content-Based Filtering using TF-IDF vectorisation of movie keywords and cosine similarity

**Recommendation Engine (Phase 3 — Planned):**
- Collaborative Filtering using matrix factorisation (SVD via scikit-surprise or LightFM)

**Frontend:** A Next.js 16 application built with React 19 and TypeScript, offering a premium Netflix-inspired UI with animated transitions, responsive layouts, and a complete browsing experience including categorised movie rows, a search page, a movie detail page, and a personal watchlist.

---

---

# 2. Literature Survey

## 2.1 Overview

This chapter surveys the principal academic literature, industry research, and technical resources that informed the design of the NFLIX system. The survey is organised thematically, progressing from the theoretical foundations of recommendation systems through specific algorithmic approaches to practical industry implementations and related tools.

## 2.2 Foundations of Recommendation Systems

### 2.2.1 The Collaborative Filtering Paradigm

The collaborative filtering paradigm rests on the intuition that people who agreed on preferences in the past are likely to agree again in the future. Formally, if user A and user B have rated a set of items similarly, then the rating user A would give to an item unseen by A but rated highly by B can be predicted from B's rating.

**Goldberg et al. (1992)** introduced the concept of collaborative filtering in their Tapestry system, which allowed email readers to annotate messages with comments ("this is spam", "highly recommended") and use those annotations to filter incoming mail for others. Though primitive by modern standards, Tapestry established the core principle: aggregated human judgements can be used to personalise information delivery.

**Resnick et al. (1994)** extended this to the GroupLens project, the first large-scale collaborative filtering system applied to Usenet news articles. GroupLens introduced the concept of computing **Pearson correlation coefficients** between user rating vectors as a measure of similarity — a technique that remains conceptually central to user-based CF today.

**Breese, Heckerman, and Kadie (1998)** conducted an empirical comparison of collaborative filtering algorithms, establishing the benchmarking methodology that subsequent research would rely on. Their work introduced the distinction between **memory-based methods** (which compute predictions directly from stored ratings) and **model-based methods** (which first learn a model from the rating data and then make predictions from the model). This distinction remains foundational.

### 2.2.2 Item-Based Collaborative Filtering

As user-based CF systems scaled to millions of users, their computational costs became prohibitive. Computing similarity between all pairs of users in a database of one million users requires ~500 billion comparisons. **Sarwar, Karypis, Konstan, and Riedl (2001)** at Amazon proposed a solution: item-based collaborative filtering. Rather than finding similar users, item-based CF finds items that are commonly rated together by users and uses this information to make predictions.

Item-based CF offers two key advantages:
1. **Scalability:** The number of items is typically much smaller than the number of users, and items change less frequently, allowing similarity matrices to be precomputed offline.
2. **Stability:** Item-item relationships are more stable than user-user relationships, since item attributes change slowly while user behaviour can be volatile.

Amazon deployed item-based CF as the backbone of their "Customers who bought X also bought Y" feature, which became one of the most commercially impactful recommendation systems in history. Linden, Smith, and York (2003) documented this deployment, reporting significant improvements in purchase conversion rates.

### 2.2.3 Matrix Factorisation

The Netflix Prize competition (2006–2009) produced a significant leap forward in recommendation system capability. The winning approach, documented by **Koren, Bell, and Volinsky (2009)** in "Matrix Factorization Techniques for Recommender Systems," demonstrated that matrix factorisation methods substantially outperformed neighbourhood-based CF on the Netflix dataset.

The core idea is to represent both users and items as vectors in a shared k-dimensional **latent factor space**. Each dimension captures an underlying, interpretable preference — for example, one dimension might correspond to a preference for action films, another for foreign language films, and another for a specific era. A user's predicted rating for a movie is computed as the **dot product** of the user's latent factor vector and the movie's latent factor vector.

The factorisation is learned by minimising the reconstruction error on observed ratings using Stochastic Gradient Descent (SGD) or Alternating Least Squares (ALS). The beauty of this approach is that unobserved ratings are implicitly "filled in" by the model — the user's latent factors generalise their preferences to movies they have not yet seen.

**Koren (2008)** extended the basic factorisation model with temporal dynamics, recognising that user preferences and movie popularity evolve over time. This temporal model further improved recommendation quality on the Netflix dataset.

The NFLIX system's Phase 3 roadmap adopts matrix factorisation via the `scikit-surprise` library (which implements SVD) or `LightFM` (which supports both pure CF and hybrid CF+content approaches).

## 2.3 Content-Based Filtering

### 2.3.1 Foundations

Content-Based Filtering (CBF) takes a fundamentally different approach to the recommendation problem. Rather than reasoning about other users' behaviour, CBF reasons about the **attributes of items** and the **attributes that the current user has shown interest in**. The system builds a profile of the user's content preferences and recommends items whose attributes match that profile.

**Pazzani and Billsus (2007)** provide a comprehensive survey of content-based recommendation systems. In the context of movies, the relevant item attributes include genre, director, cast, thematic keywords extracted from plot summaries, release decade, and critic ratings. A user who has watched and liked multiple Christopher Nolan films might have a content profile indicating a preference for psychologically complex narratives, non-linear storytelling, and high-budget science fiction.

### 2.3.2 TF-IDF Representation

A central challenge in CBF is representing textual item attributes in a form suitable for mathematical comparison. The **TF-IDF (Term Frequency–Inverse Document Frequency)** technique, originally developed for information retrieval, has been widely adopted for this purpose.

TF-IDF assigns a weight to each term in a document (in this case, a movie's keywords or overview):
- **Term Frequency (TF):** How often does the term appear in this document? Frequent terms are considered more representative.
- **Inverse Document Frequency (IDF):** How rare is this term across all documents? Rare terms are considered more distinctive and informative.

The combined TF-IDF weight is high for terms that appear frequently in a specific document but rarely across the corpus — exactly the terms most useful for distinguishing one movie from another. After computing TF-IDF vectors for all movies, **cosine similarity** measures the angle between any two movie vectors. A cosine similarity of 1 indicates identical content profiles; 0 indicates no shared content attributes.

In NFLIX, the Phase 2 upgrade uses `sklearn.feature_extraction.text.TfidfVectorizer` on the `keywords` field of the `movies` table to compute movie-movie cosine similarity matrices. The code for this is fully written and scaffolded as commented blocks in `recommendations.py`, ready to activate by uncommenting and installing the `scikit-learn` dependency.

### 2.3.3 Limitations of Content-Based Filtering

CBF has a well-documented limitation: it can only recommend items that are similar to those a user has already encountered. It cannot lead users to discover films from entirely new genres or styles. A user who has only watched action films will only ever be recommended more action films — the system is inherently conservative. This limitation is addressed in hybrid systems by combining CBF with CF.

## 2.4 Hybrid Recommendation Systems

### 2.4.1 The Netflix Recommender System

The most influential published description of a production-scale hybrid recommendation system is **Gomez-Uribe and Hunt (2015)**, "The Netflix Recommender System: Algorithms, Business Value, and Innovation," published in ACM Transactions on Management Information Systems.

This paper reveals that Netflix employs dozens of distinct algorithms in its recommendation infrastructure, combined through a layered architecture:
- **Personalised Video Ranking (PVR):** Ranks all videos for a specific user based on their personal tastes.
- **Top-N Video Ranker:** Generates globally popular item recommendations, filtered by personal preferences.
- **Trending Now:** Identifies videos gaining rapid popularity using a short-term popularity signal.
- **Continue Watching:** Surfaces content the user has partially watched.
- **Because You Watched (BYW):** Uses item-item similarity (content-based or CF-based) to explain recommendations.
- **Page Generation:** Assembles the rows visible on the Netflix homepage, selecting which rows to show, in what order, and how many items to display.

Key design insights from this paper that directly influenced NFLIX's design:

1. **Row-based presentation:** Netflix presents recommendations in labelled rows (e.g., "Trending Now", "Top Rated", "Because you watched Inception"). This provides transparency — the user understands why each item is recommended — and allows different algorithms to coexist on a single page without confusion.

2. **Diversity vs. relevance tradeoff:** A page consisting entirely of the top-20 most relevant movies for a user would likely show 20 very similar movies. Netflix deliberately diversifies recommendations across rows to expose users to a broader set of content.

3. **Evidence and presentation:** The visual presentation of recommendations (thumbnail choice, video preview) is itself a personalisation layer. Netflix has found that the thumbnail that most entices a user to click on a movie may differ by user — a user with a preference for romantic comedies might click on a poster featuring an emotional moment, while an action-oriented user might click on a poster featuring an action sequence from the same movie.

NFLIX implements items 1 and 2 directly: the Browse page presents distinct labelled rows (Trending Now, Top Rated, Recommended For You, Because You Liked X, and genre rows), each driven by a different algorithm.

### 2.4.2 Other Hybrid Approaches

**Burke (2002)** proposed a taxonomy of hybridisation strategies including:
- **Weighted:** Combining scores from multiple recommendation algorithms with learned weights.
- **Switching:** Choosing between algorithms based on context (e.g., use CF when sufficient data exists, fall back to CBF for new users).
- **Mixed:** Presenting recommendations from multiple algorithms simultaneously (as in NFLIX's row-based layout).
- **Feature Augmentation:** Using the output of one algorithm as input features for another.
- **Cascade:** Using one algorithm to produce a coarse ranking, then refining with a second algorithm.

NFLIX's phased architecture implements the **switching** strategy implicitly: Phase 1 heuristics serve as the cold-start fallback, Phase 2 content-based filtering enriches similarity computation, and Phase 3 collaborative filtering takes over the personalised ranking when sufficient interaction data exists.

## 2.5 Evaluation of Recommendation Systems

Recommendation system quality is evaluated along multiple dimensions:

### 2.5.1 Accuracy Metrics

| Metric | Description | Formula |
|--------|-------------|---------|
| MAE (Mean Absolute Error) | Average magnitude of rating prediction error | `(1/n) Σ |r_predicted - r_actual|` |
| RMSE (Root Mean Square Error) | Square root of mean squared error; penalises large errors more | `√((1/n) Σ (r_predicted - r_actual)²)` |
| Precision@K | Fraction of top-K recommendations that are relevant | `relevant_in_K / K` |
| Recall@K | Fraction of all relevant items captured in top-K | `relevant_in_K / total_relevant` |
| NDCG@K | Normalised Discounted Cumulative Gain — rewards highly relevant items appearing earlier in the list | Weighted sum with log discount |

### 2.5.2 Beyond Accuracy

**McNee, Riedl, and Konstan (2006)** argued persuasively that optimising purely for prediction accuracy can be counterproductive from a user satisfaction perspective. A perfectly accurate recommender that always recommends the same five popular movies would score well on MAE but poorly on user satisfaction. They proposed evaluating recommendation systems on:
- **Novelty:** Are users discovering items they would not have found on their own?
- **Serendipity:** Are users pleasantly surprised by recommendations?
- **Diversity:** Do recommendations span a broad range of item types?
- **Coverage:** What fraction of the item catalogue can the system recommend?

NFLIX implicitly addresses novelty and diversity through the row-based presentation and the "Because you liked X" row — which exposes users to content similar to their tastes but from a specific starting point they may not have explored.

## 2.6 Related Systems and Comparative Analysis

| System | Recommendation Approach | UI | Real-time Personalisation | Open Source |
|--------|------------------------|----|--------------------------|-------------|
| Netflix | Hybrid (CF + CBF + Contextual + Temporal) | Proprietary | Yes | No |
| MovieLens | CF (academic benchmark platform) | Basic web UI | Yes | Partially |
| Letterboxd | Social + Explicit ratings + Editorial | Polished social UI | Limited | No |
| IMDb | Popularity + Editorial | Comprehensive metadata | No | No |
| Rotten Tomatoes | Editorial + Critic aggregation | Review-focused | No | No |
| Trakt.tv | CF + Social | Minimalist | Limited | Partial API |
| **NFLIX (this project)** | **Heuristic → CBF → CF (phased)** | **Netflix-inspired** | **Yes (Phase 1)** | **Yes** |

## 2.7 Data Sources for Movie Recommendation

### 2.7.1 The Movie Database (TMDB)

TMDB (themoviedb.org) is the primary open-access movie metadata API used in this project. Unlike IMDb, which restricts data access to licensed partners, TMDB offers a comprehensive, freely accessible API (with rate limits) covering:
- Movie metadata: title, overview, release date, runtime, vote_average, vote_count, adult rating
- Genre taxonomy: 19 standardised genre categories with numeric IDs
- Credits: full cast and crew information with role types
- Keywords: curated thematic keywords extracted from plot
- Videos: YouTube trailer keys
- Images: poster and backdrop image paths (served via `image.tmdb.org/t/p/`)

TMDB's genre taxonomy uses consistent numeric identifiers (e.g., 28 = Action, 878 = Science Fiction, 18 = Drama), which NFLIX uses as the primary feature for genre-based filtering and recommendation.

### 2.7.2 MovieLens Dataset

The MovieLens dataset, maintained by the GroupLens Research Lab at the University of Minnesota, is the most widely used benchmark dataset in recommendation systems research. Available in multiple sizes (100K, 1M, 10M, 20M, and 25M ratings), it contains anonymised movie ratings from real users on the MovieLens platform. While NFLIX uses TMDB rather than MovieLens as its data source (to access richer metadata and avoid static dataset limitations), the recommendation algorithms in NFLIX are designed to be compatible with MovieLens-style rating data.

---

---

# 3. Major Objective & Scope of Project

## 3.1 Vision Statement

The vision of the NFLIX project is to design and implement a complete, production-quality movie recommendation web application that demonstrates the full lifecycle of a data-driven recommendation system — from data ingestion and persistence through machine learning model design to user interface delivery — while remaining educational, maintainable, and extensible.

## 3.2 Primary Objectives

The following primary objectives guided every design and implementation decision in this project:

### Objective 1: Full-Stack System Integration
Build a vertically integrated system in which a modern React/Next.js frontend, a FastAPI RESTful backend, and a PostgreSQL relational database communicate seamlessly over standard HTTP protocols. Demonstrate that a small, well-organised team (or individual developer) can architect and deliver a production-quality three-tier application.

### Objective 2: Real-World Data Integration
Design and implement a data pipeline that fetches, enriches, and locally caches real movie records from the TMDB public API. The pipeline must handle API rate limits gracefully, support upsert operations (so it can be run repeatedly without creating duplicate records), and capture all metadata required for recommendation computation (genres, keywords, cast, director, ratings, trailer references).

### Objective 3: Phased Recommendation Engine
Implement a recommendation engine in three explicitly defined phases, where each phase is more algorithmically sophisticated than the previous and activates as the system's interaction dataset grows:
- **Phase 1 (Implemented):** Heuristic and genre-weighted recommendations
- **Phase 2 (Scaffolded):** TF-IDF content-based filtering using movie keywords
- **Phase 3 (Planned):** Collaborative filtering via matrix factorisation

### Objective 4: Multi-Profile User System
Implement a Netflix-style multi-profile system where a single registered account can maintain multiple independent viewer profiles. Each profile has its own avatar, language preference, maturity level, favourite genre list, interaction history, and watchlist. Profile switching updates the personalised recommendations on the Browse page in real time.

### Objective 5: Interaction Data Collection
Design and implement a comprehensive interaction logging system that records all user-movie interactions — likes, dislikes, watchlist additions, watchlist removals, clicks, and watches — as timestamped database records. These records form the training data for Phase 3 collaborative filtering.

### Objective 6: Industry-Standard Security
Implement authentication using bcrypt password hashing and HS256-signed JWT tokens, following current industry best practices. Ensure that the backend is stateless (no server-side sessions), making it horizontally scalable and suitable for cloud deployment.

### Objective 7: Premium User Experience
Design and deliver a user interface that meets or exceeds the visual quality of commercial streaming applications, using modern design patterns including dark mode, glassmorphism, gradient backgrounds, and Framer Motion animations. The interface must be responsive across desktop, tablet, and mobile viewports.

## 3.3 Secondary Objectives

- Produce a self-documenting API using FastAPI's automatic OpenAPI/Swagger generation, allowing developers to explore and test all endpoints without external documentation.
- Implement CORS (Cross-Origin Resource Sharing) middleware correctly to allow the frontend to communicate with the backend across different ports in development.
- Design the database schema with foreign key constraints and cascade deletion rules to ensure referential integrity.
- Implement debounced real-time search to avoid excessive API calls while maintaining a responsive user experience.
- Gracefully handle the case where the backend is offline by falling back to `localStorage` for watchlist and interaction state.
- Implement a community score visualisation (progress bar showing `vote_average × 10%`) that communicates movie quality intuitively without requiring numerical literacy.

## 3.4 Scope Definition

### 3.4.1 Functional Scope — Included

The following functional areas are within scope for this project:

**User Account Management**
- New user registration with name, email address, and password
- User login and logout with JWT token management
- Fetching the current user's profile information via token

**Multi-Profile Management**
- Creating multiple named profiles under one account
- Assigning avatars and language preferences to profiles
- Setting maturity level per profile (all, teen, adult)
- Selecting and switching the active profile

**Movie Catalogue**
- Displaying movies in paginated, filterable lists
- Filtering movies by genre using TMDB's numeric genre IDs
- Full-text title search with real-time debouncing
- Individual movie detail pages with complete metadata

**Recommendations**
- Trending row (vote_average × log(vote_count + 1))
- Top Rated row (vote_average ≥ threshold, vote_count > 100)
- Recommended For You (genre-weighted personalisation)
- Because You Liked X (similar movies to a randomly selected liked film)
- Genre-specific rows (Action, Sci-Fi, Drama, Comedy, Thriller, Animation)
- Similar Movies section on each movie detail page

**User Interactions**
- Like / dislike movie toggling with backend persistence
- Add to / remove from watchlist with backend persistence
- Interaction logging (like, dislike, watchlist_add, watchlist_remove, click, watch)
- localStorage fallback for offline state persistence

**Data Ingestion**
- Automated TMDB data fetching for popular, top-rated, and trending endpoints
- Full enrichment with credits (director, cast), keywords, and trailers
- Upsert strategy for idempotent script execution
- Rate-limit-compliant request pacing

### 3.4.2 Functional Scope — Excluded

The following are explicitly out of scope:

- Video hosting, encoding, or streaming (no actual movies are played)
- Email verification on account creation
- Password reset via email
- Social features (following users, sharing lists, reviews)
- Advanced collaborative filtering (Phase 3 — requires substantial interaction data)
- Payment processing or subscription management
- Native iOS or Android applications
- Push notifications
- Subtitle or multi-language video track management
- Content upload or moderation tools

### 3.4.3 Non-Functional Scope

- The system must serve API responses for common queries in under 500ms under normal load.
- The frontend must render initial content within 2 seconds on a standard broadband connection.
- The backend must be stateless and deployable to standard cloud PaaS environments (Railway, Render).
- The system must gracefully handle TMDB API unavailability by serving from the local cache.

---

---

# 4. Problem Analysis and Requirement Specification

## 4.1 Feasibility Analysis

A feasibility study was conducted across three dimensions before beginning development to confirm that the project could be completed within available resources and constraints.

### 4.1.1 Technical Feasibility

**Language and Framework Maturity:** The project uses Python (version 3.10), one of the most widely adopted programming languages in the world with a mature ecosystem for web development and machine learning. FastAPI is a high-performance, production-ready web framework used by Microsoft, Netflix, and Uber. Next.js is the most widely deployed React framework for production web applications. All technologies are well-documented, actively maintained, and have large communities.

**Database:** PostgreSQL is a battle-tested, ACID-compliant relational database capable of handling millions of records with high concurrency. It is the most capable open-source relational database available, with mature Python drivers (`psycopg2`), a robust ORM (`SQLAlchemy`), and free cloud hosting options.

**TMDB API:** The TMDB API is freely available for non-commercial use with clear documentation and a generous rate limit (approximately 40 requests per second per IP address). It provides all the movie metadata required for this project.

**Developer Resources:** All technologies, frameworks, and cloud services used in this project are either entirely free or have free tiers sufficient for development and demonstration purposes.

**Conclusion:** The project is fully technically feasible.

### 4.1.2 Operational Feasibility

**Deployment:** The frontend can be deployed to Vercel's free tier with zero configuration, as Vercel is Next.js's creator and offers native support. The backend can be deployed to Railway or Render with a free tier. The database is hosted on Neon, which offers a generous free PostgreSQL tier.

**User Access:** As a web application, NFLIX requires no installation on the user's device. Any device with a modern web browser (Chrome, Firefox, Safari, Edge) and an internet connection can access the application.

**Maintenance:** The TMDB ingestion script can be run on a schedule (e.g., weekly) to keep the movie catalogue current. No manual intervention is required for routine operation.

**Conclusion:** The project is operationally feasible.

### 4.1.3 Economic Feasibility

**Development Costs:** Zero. All programming languages, frameworks, libraries, and development tools used in this project are open-source and free of charge.

**Hosting Costs:** Zero for development and demonstration. Free tiers from Vercel, Railway/Render, and Neon cover all hosting needs.

**API Costs:** Zero. TMDB's API is free for non-commercial, educational, and personal use.

**Scaling Costs:** If the system were to scale to production levels, costs would increase. However, for the scope of this academic project, all costs are zero.

**Conclusion:** The project is economically feasible with zero mandatory expenditure.

## 4.2 Stakeholder Analysis

| Stakeholder | Interest | Concern |
|-------------|----------|---------|
| End User (Movie Browser) | Discover movies they enjoy with minimal effort | Irrelevant recommendations; slow performance; confusing UI |
| Registered User | Personal watchlist and personalised recommendations | Privacy of interaction data; account security |
| System Administrator | Up-to-date movie catalogue; system health | TMDB API rate limits; database growth; downtime |
| Academic Evaluator | Demonstration of software engineering and ML concepts | Code quality; documentation; architectural clarity |
| Developer/Maintainer | Maintainable, extensible codebase | Technical debt; unclear module boundaries |

## 4.3 Functional Requirements

The following functional requirements were identified through stakeholder analysis and use case modelling.

### Module 1: Authentication and User Management

| Req. ID | Requirement Description | Priority | Verification |
|---------|------------------------|----------|-------------|
| FR-01 | The system shall allow a new user to register by providing a full name, email address, and password | Critical | POST /api/auth/signup returns 201 |
| FR-02 | The system shall reject registration attempts where the email address is already in use | High | POST /api/auth/signup returns 400 with message "Email already registered" |
| FR-03 | The system shall create a default viewer profile for the user upon successful registration | High | Profile count for new user = 1 |
| FR-04 | The system shall authenticate a user by verifying email and password, returning a JWT access token | Critical | POST /api/auth/login returns 200 with `access_token` |
| FR-05 | The system shall return HTTP 401 for login attempts with incorrect credentials | High | POST /api/auth/login with wrong password returns 401 |
| FR-06 | The system shall allow authenticated users to retrieve their user profile including all viewer profiles | High | GET /api/auth/me returns UserOut with profiles array |
| FR-07 | The system shall implement a logout endpoint that instructs the client to discard the token | Medium | POST /api/auth/logout returns 200 |

### Module 2: Profile Management

| Req. ID | Requirement Description | Priority | Verification |
|---------|------------------------|----------|-------------|
| FR-08 | Each user account shall support multiple independent viewer profiles | High | Profile table with FK to users.id |
| FR-09 | Each profile shall store a name, avatar image path, favourite genre list, preferred language, and maturity level | High | Profile model fields present |
| FR-10 | The active profile selection shall determine which interaction history is used for personalised recommendations | Critical | For-You endpoint accepts profile_id query param |
| FR-11 | Deleting a user account shall cascade and delete all associated profiles, interactions, and watchlist entries | High | CASCADE delete configured in SQLAlchemy model |

### Module 3: Movie Browsing and Search

| Req. ID | Requirement Description | Priority | Verification |
|---------|------------------------|----------|-------------|
| FR-12 | The system shall return a paginated list of all movies, ordered by vote_average descending | High | GET /api/movies returns list of MovieOut |
| FR-13 | The system shall support filtering the movie list by genre using a numeric genre_id query parameter | High | GET /api/movies?genre_id=28 returns only Action movies |
| FR-14 | The system shall support full-text title search against the local database | High | GET /api/movies/search?q=inception returns matching movies |
| FR-15 | The search endpoint shall use case-insensitive matching | Medium | Search for "INCEPTION" and "inception" return same results |
| FR-16 | The system shall return a single movie's complete metadata by its TMDB ID | High | GET /api/movies/{id} returns full MovieOut |
| FR-17 | The system shall return HTTP 404 if a requested movie ID does not exist in the local database | Medium | GET /api/movies/99999 returns 404 |

### Module 4: Recommendations

| Req. ID | Requirement Description | Priority | Verification |
|---------|------------------------|----------|-------------|
| FR-18 | The system shall provide a Trending endpoint returning movies ranked by `vote_average × log(vote_count + 1)` | High | GET /api/recommendations/trending returns 20 movies |
| FR-19 | The system shall provide a Top Rated endpoint returning movies filtered to vote_count > 100, sorted by vote_average | High | GET /api/recommendations/top-rated returns high-rated movies |
| FR-20 | The system shall provide a For-You personalised endpoint that excludes movies the user has already interacted with | Critical | Interacted movie IDs excluded from For-You results |
| FR-21 | The For-You endpoint shall score candidates by genre preference weight derived from the profile's liked movies | Critical | Genre weight scoring implemented in recommendations.py |
| FR-22 | The system shall provide a Similar Movies endpoint returning movies sharing at least one genre with the target movie | High | GET /api/recommendations/similar/{id} returns genre-overlapping movies |
| FR-23 | The system shall provide a Rows endpoint assembling all homepage rows including personalised rows for logged-in users | High | GET /api/recommendations/rows returns ordered list of rows |
| FR-24 | When a profile_id is provided to the Rows endpoint, a "Recommended For You" row shall be inserted at position 0 | High | First row title = "Recommended For You" when profile_id provided |
| FR-25 | When a profile has liked at least one movie, a "Because you liked X" row shall be inserted at position 1 | Medium | Second row title = "Because you liked [title]" |

### Module 5: User Interactions

| Req. ID | Requirement Description | Priority | Verification |
|---------|------------------------|----------|-------------|
| FR-26 | The system shall accept and persist interaction records with action types: like, dislike, watchlist_add, watchlist_remove, click, watch | Critical | POST /api/interactions returns 201 with InteractionOut |
| FR-27 | The system shall reject interaction records with invalid action_type values | Medium | Returns 400 with error message |
| FR-28 | A watchlist_add interaction shall simultaneously insert a record into the watchlist table | High | WatchlistItem created on watchlist_add |
| FR-29 | A watchlist_remove interaction shall simultaneously delete the corresponding watchlist record | High | WatchlistItem deleted on watchlist_remove |
| FR-30 | The system shall handle concurrent watchlist_add requests without creating duplicate entries | High | IntegrityError caught and handled in interactions.py |

### Module 6: Watchlist Management

| Req. ID | Requirement Description | Priority | Verification |
|---------|------------------------|----------|-------------|
| FR-31 | The system shall return the complete watchlist for a given profile | High | GET /api/users/{id}/watchlist returns WatchlistItemOut list |
| FR-32 | The system shall support adding a movie to the watchlist via POST | High | POST /api/users/{id}/watchlist adds item |
| FR-33 | The system shall support removing a movie from the watchlist via DELETE | High | DELETE /api/users/{id}/watchlist/{movie_id} removes item |
| FR-34 | The system shall return aggregate statistics for a profile (total watched, liked, watchlist count) | Medium | GET /api/users/{id}/stats returns UserStatsOut |

## 4.4 Non-Functional Requirements

| Req. ID | Requirement | Category | Metric |
|---------|-------------|----------|--------|
| NFR-01 | Passwords shall never be stored in plaintext; bcrypt hashing with automatic salting shall be used | Security | bcrypt.hashpw() used in all password creation paths |
| NFR-02 | All API endpoints that modify user data shall require a valid JWT Bearer token | Security | get_current_user dependency applied |
| NFR-03 | JWT tokens shall expire after 24 hours | Security | ACCESS_TOKEN_EXPIRE_MINUTES = 1440 in config |
| NFR-04 | The frontend application shall be fully responsive for screen widths from 360px (mobile) to 1920px (desktop) | Usability | Tested at 360px, 768px, 1024px, 1440px, 1920px |
| NFR-05 | Search results shall appear within 300ms after the user stops typing (debounce) | Performance | SEARCH_DEBOUNCE_MS = 300 in constants.ts |
| NFR-06 | The API shall return appropriate HTTP status codes (200, 201, 400, 401, 404, 500) | Reliability | Consistent status codes across all routes |
| NFR-07 | The system shall handle concurrent duplicate watchlist additions without raising unhandled exceptions | Reliability | IntegrityError caught; rollback and continue |
| NFR-08 | Database sessions shall be closed in a `finally` block after each request | Performance | get_db() generator uses try/finally |
| NFR-09 | The TMDB ingestion script shall not exceed 40 requests per second to the TMDB API | Reliability | 0.25s–0.3s sleep between requests |
| NFR-10 | The backend shall implement CORS headers allowing the configured frontend origin | Security | CORSMiddleware with ALLOWED_ORIGINS |
| NFR-11 | API responses shall include only the fields defined in the Pydantic response model | Security | Response models enforced by FastAPI |
| NFR-12 | The ingestion script shall commit to the database in batches of 50 records to balance performance and safety | Performance | Batch commit every 50 movies |

## 4.5 Use Case Descriptions

### Use Case UC-01: User Registration

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-01 |
| **Use Case Name** | Register New User |
| **Actor** | Guest User |
| **Precondition** | User is not currently authenticated |
| **Trigger** | User navigates to /signup and submits the registration form |
| **Main Flow** | 1. User enters name, email, and password. 2. System validates input (non-empty, valid email format). 3. System checks if email is already registered. 4. System hashes password using bcrypt. 5. System creates User record in database. 6. System creates a default Profile linked to the User. 7. System auto-logs the user in by issuing a JWT. 8. System stores token in localStorage. 9. System redirects user to /browse. |
| **Alternate Flow** | 3a. If email is already registered → System returns error "Email already registered". Form displays error message. |
| **Postcondition** | User is authenticated; JWT stored in localStorage; default profile created |

---

### Use Case UC-02: Browse Movies

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-02 |
| **Use Case Name** | Browse Movie Rows |
| **Actor** | Guest User or Authenticated User |
| **Precondition** | User is on the /browse page |
| **Trigger** | Page loads |
| **Main Flow** | 1. Frontend calls GET /api/recommendations/rows (with profile_id if logged in). 2. Backend assembles rows: Trending, Top Rated, and genre rows. 3. If profile_id provided, backend calls for-you and similar endpoints and prepends personalised rows. 4. Frontend renders labelled rows of horizontally scrollable movie cards. |
| **Alternate Flow** | 4a. If backend is unreachable → Frontend displays a loading spinner, then shows an error state with retry option. |
| **Postcondition** | User sees categorised movie rows; personalised rows visible for authenticated users |

---

### Use Case UC-03: Like a Movie

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-03 |
| **Use Case Name** | Like a Movie |
| **Actor** | Authenticated User |
| **Precondition** | User is authenticated and viewing a movie's detail page or movie card |
| **Trigger** | User clicks the "Like" button |
| **Main Flow** | 1. User clicks Like button. 2. Frontend checks isAuthenticated. 3. AuthContext calls toggleLike(movieId). 4. React state is updated optimistically (liked = true). 5. Frontend posts to POST /api/interactions with action_type = "like". 6. Backend creates Interaction record in database. 7. Button UI updates to show "Liked" state with green styling. |
| **Alternate Flow** | 2a. If user is not authenticated → Guest modal appears prompting sign-up or login. |
| **Postcondition** | Interaction record persisted; liked state reflected in UI; affects future For-You recommendations |

---

### Use Case UC-04: Search for a Movie

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-04 |
| **Use Case Name** | Search Movie by Title |
| **Actor** | Guest or Authenticated User |
| **Precondition** | User is on the /search page |
| **Trigger** | User types a query into the search bar |
| **Main Flow** | 1. User types a title query. 2. useSearch hook starts a 300ms debounce timer. 3. After 300ms inactivity, hook calls GET /api/movies/search?q={query}. 4. Backend performs ILIKE search on movie titles. 5. Results are displayed as a responsive grid of movie cards. |
| **Alternate Flow** | 4a. If no movies match the query → Empty state message shown ("No results found"). |
| **Postcondition** | Relevant movie results displayed; user can click any card to view details |

---

### Use Case UC-05: Add Movie to Watchlist

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-05 |
| **Use Case Name** | Add Movie to Watchlist |
| **Actor** | Authenticated User |
| **Precondition** | User is authenticated; movie is not already in their watchlist |
| **Trigger** | User clicks "My List" button on a movie card or detail page |
| **Main Flow** | 1. User clicks "My List". 2. AuthContext.addToMyList(movie) is called. 3. Movie is added to React state immediately (optimistic update). 4. userService.addToWatchlist(profileId, movieId) POSTs to backend. 5. movieService.logInteraction(movieId, 'watchlist_add', profileId) also called. 6. Backend creates WatchlistItem in watchlist table. 7. Button updates to show "In My List" with check icon. |
| **Alternate Flow** | 2a. If user is not authenticated → Guest modal appears. |
| **Postcondition** | WatchlistItem persisted in DB; localStorage updated; button shows "In My List" |

## 4.6 System Activity Flow

### 4.6.1 Authentication Activity

The authentication flow proceeds as follows: A guest user visits the landing page. They navigate to the Sign Up form, enter their details, and submit. The system validates input client-side (non-empty fields, email format). The registration request is sent to the backend. If successful, an auto-login is performed and the user is redirected to /browse. If the email is taken, an error is shown. On /browse, the frontend checks for a stored JWT token in localStorage; if found, it calls GET /api/auth/me to restore the session.

### 4.6.2 Recommendation Delivery Activity

When a user opens /browse: The frontend calls GET /api/recommendations/rows with the active profile_id (if authenticated). The backend's Rows endpoint calls the Trending, Top Rated, and genre-specific functions internally. If a profile_id is present, it calls For-You (building a genre weight map from liked interactions) and Similar (picking a random liked movie and finding similar ones). The assembled list of row objects is returned to the frontend. The frontend renders each row as a labeled, horizontally scrollable set of movie cards. Cards display poster image, title, and year.

---

---

# 5. Detailed Design (Modeling and ERD/DFD)

## 5.1 Overall System Architecture

NFLIX follows a classical **three-tier architecture** in which the presentation, business logic, and data storage concerns are separated into distinct layers that communicate through well-defined interfaces.

### 5.1.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER                             │
│                 Next.js 16 / React 19 / TypeScript                  │
│                    Port 3000 (Dev) / Vercel (Prod)                  │
│                                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  ┌────────────┐ │
│  │  Landing    │  │  Browse Page │  │  Search   │  │  My List   │ │
│  │  Page       │  │  (Rows + Hero│  │  Page     │  │  Page      │ │
│  └─────────────┘  └──────────────┘  └───────────┘  └────────────┘ │
│  ┌──────────────────────┐  ┌─────────────────────────────────────┐ │
│  │  Movie Detail Page   │  │  Auth Pages (Login / Sign-up)       │ │
│  └──────────────────────┘  └─────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  AuthContext (JWT, User, Profiles, Watchlist, Likes)        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP REST (JSON)
                               │ Bearer Token in Authorization Header
┌──────────────────────────────▼──────────────────────────────────────┐
│                         BUSINESS TIER                                │
│              FastAPI 0.115 / Python 3.10 / Uvicorn 0.29             │
│                    Port 8000 (Dev) / Railway (Prod)                 │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐ ┌──────────────────┐ │
│  │ Auth     │ │ Movies   │ │ Recommend.    │ │ Interactions     │ │
│  │ Router   │ │ Router   │ │ Router        │ │ Router           │ │
│  └──────────┘ └──────────┘ └───────────────┘ └──────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Core: Config / Database / Security (JWT + bcrypt)           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  SQLAlchemy ORM (Models + Session Management)                │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ SQLAlchemy / psycopg2
┌──────────────────────────────▼──────────────────────────────────────┐
│                           DATA TIER                                  │
│              PostgreSQL 15 (Neon Serverless / Local)                │
│                                                                     │
│  ┌───────┐  ┌─────────┐  ┌────────┐  ┌──────────────┐  ┌────────┐ │
│  │ users │  │profiles │  │ movies │  │ interactions │  │watchl. │ │
│  └───────┘  └─────────┘  └────────┘  └──────────────┘  └────────┘ │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS API
┌──────────────────────────────▼──────────────────────────────────────┐
│                        EXTERNAL SERVICES                             │
│  ┌──────────────────────────┐   ┌────────────────────────────────┐  │
│  │   TMDB API               │   │  YouTube (Trailer Embedding)   │  │
│  │   api.themoviedb.org/3   │   │  (via trailer_key from TMDB)  │  │
│  └──────────────────────────┘   └────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.1.2 Communication Protocol

All communication between the frontend and backend uses **HTTP/1.1** (or HTTP/2 in production) with **JSON** as the data interchange format. The frontend attaches the JWT token as a `Bearer` token in the `Authorization` request header for all authenticated endpoints.

Error responses follow HTTP conventions: `200 OK` for successful GET, `201 Created` for successful POST, `400 Bad Request` for validation failures, `401 Unauthorized` for missing or invalid tokens, `404 Not Found` for missing resources, and `500 Internal Server Error` for unexpected backend failures.

## 5.2 Database Design

### 5.2.1 Entity-Relationship Diagram (ERD)

The database schema comprises five entities with the following relationships:

```
USERS
─────────────────────────────────
PK  id            : VARCHAR (UUID)
    email         : VARCHAR UNIQUE NOT NULL
    name          : VARCHAR NOT NULL
    password_hash : VARCHAR NOT NULL
    created_at    : TIMESTAMP DEFAULT NOW()
         │
         │ 1 ──── N
         ▼
PROFILES
─────────────────────────────────
PK  id              : VARCHAR (UUID)
FK  user_id         : VARCHAR → users.id (CASCADE DELETE)
    name            : VARCHAR NOT NULL
    avatar          : VARCHAR
    favorite_genres : VARCHAR (CSV of genre IDs e.g. "28,12,878")
    language        : VARCHAR DEFAULT 'en'
    maturity_level  : VARCHAR DEFAULT 'all'   -- all | teen | adult
    created_at      : TIMESTAMP DEFAULT NOW()
         │
         ├── 1 ──── N ──► INTERACTIONS
         │
         └── 1 ──── N ──► WATCHLIST

INTERACTIONS
─────────────────────────────────
PK  id          : VARCHAR (UUID)
FK  profile_id  : VARCHAR → profiles.id (CASCADE DELETE)  [INDEXED]
FK  movie_id    : INTEGER → movies.id                     [INDEXED]
    action_type : VARCHAR  -- like|dislike|watchlist_add|watchlist_remove|click|watch
    created_at  : TIMESTAMP DEFAULT NOW()                 [INDEXED]

WATCHLIST
─────────────────────────────────
PK  id          : VARCHAR (UUID)
FK  profile_id  : VARCHAR → profiles.id (CASCADE DELETE)  [INDEXED]
FK  movie_id    : INTEGER → movies.id
    added_at    : TIMESTAMP DEFAULT NOW()

MOVIES
─────────────────────────────────
PK  id              : INTEGER  (TMDB movie ID)
    title           : VARCHAR NOT NULL
    overview        : TEXT DEFAULT ''
    poster_path     : VARCHAR DEFAULT ''
    backdrop_path   : VARCHAR DEFAULT ''
    release_date    : VARCHAR DEFAULT ''
    vote_average    : FLOAT DEFAULT 0.0
    vote_count      : INTEGER DEFAULT 0
    runtime         : INTEGER NULL
    director        : VARCHAR NULL
    trailer_key     : VARCHAR NULL   (YouTube video key)
    maturity_rating : VARCHAR DEFAULT 'PG-13'
    genre_ids       : VARCHAR  (CSV e.g. "28,12,878")
    keywords        : TEXT     (CSV e.g. "heist, prison, redemption")
    cast_json       : TEXT     (JSON array of cast objects)
    synced_at       : TIMESTAMP DEFAULT NOW()
```

### 5.2.2 Relationship Description Table

| Relationship | Type | Description | Cascade |
|---|---|---|---|
| User → Profile | One-to-Many | A user account owns multiple profiles | Delete profile when user deleted |
| Profile → Interaction | One-to-Many | A profile accumulates interaction records over time | Delete interactions when profile deleted |
| Profile → WatchlistItem | One-to-Many | A profile has a collection of saved movies | Delete watchlist when profile deleted |
| Movie → Interaction | One-to-Many | A movie can appear in many users' interaction records | No cascade (preserve history) |
| Movie → WatchlistItem | One-to-Many | A movie can appear in many users' watchlists | No cascade (preserve history) |

### 5.2.3 Indexing Strategy

The following columns are indexed to support the most common query patterns:

| Table | Column | Reason |
|-------|--------|--------|
| users | email | Unique index; used in login and email-exists check |
| interactions | profile_id | Used in all recommendation queries |
| interactions | movie_id | Used in movie-level analytics |
| interactions | created_at | Supports temporal queries for trending and recent activity |
| watchlist | profile_id | Used in watchlist retrieval per profile |

## 5.3 Data Flow Diagrams

### 5.3.1 Level 0 — Context Diagram

```
                     ┌──────────────────────────────┐
                     │                              │
  [User / Browser]──►│   NFLIX                      │◄──[TMDB API]
          ▲          │   Movie Recommendation       │
          │          │   System                     │
          └──────────│                              │
   (movies, recs,    └──────────────────────────────┘
    watchlist, auth)
```

**External Entities:**
- **User/Browser:** Interacts with the system via a web browser. Sends registration/login credentials, search queries, profile selections, and interaction events. Receives movie listings, recommendations, and personalised content.
- **TMDB API:** An external data source. The ingestion script queries TMDB's movie endpoints to seed and periodically refresh the local movie database.

---

### 5.3.2 Level 1 — Decomposed Processes

```
         TMDB API
            │ (movie metadata)
            ▼
    ┌───────────────────┐
    │  P0: Data         │──────────────────────────────────────┐
    │  Ingestion        │                                      │
    │  (ingest_tmdb.py) │                                      │
    └───────────────────┘                                      │
                                                               │ (writes)
                                                               ▼
  User ──────────►┌──────────────────┐            ┌──────────────────────┐
  (credentials)   │ P1: Auth &       │            │   D1: movies table   │
                  │ Profile Mgmt     │            └──────────┬───────────┘
  User ◄──────────│ /api/auth/*      │                       │
  (JWT token)     └──────────┬───────┘                       │
                             │ (reads/writes)                 │
                             ▼                                │
                    ┌─────────────────┐                       │ (reads)
                    │   D2: users     │                       │
                    │   D3: profiles  │                       │
                    └─────────────────┘                       │
                                                              │
  User ──────────►┌──────────────────┐◄──────────────────────┘
  (browse, search) │ P2: Movie       │
                   │ Browsing        │
  User ◄─────────  │ /api/movies/*   │
  (movie lists)    └─────────────────┘

  User ──────────►┌──────────────────┐◄──── D1: movies
  (profile_id)    │ P3: Recommend.   │◄──── D4: interactions
                  │ Engine           │
  User ◄─────────  │ /api/recs/*     │
  (personalised   └─────────────────┘
   rows)

  User ──────────►┌──────────────────┐
  (like/dislike/  │ P4: Interaction  │──────────► D4: interactions
   watchlist)     │ Logger           │──────────► D5: watchlist
                  │ /api/interactions│
  User ◄─────────  └─────────────────┘
  (201 Created)
```

---

### 5.3.3 Level 2 — Authentication Process (P1 Expanded)

```
                        ┌─────────────────────────────────┐
User                    │      P1: Auth & Profile Mgmt    │
  │                     │                                 │
  │ POST /api/auth/     │  ┌──────────────────────────┐   │
  │ signup              ├─►│ P1.1 Validate SignupReq   │   │
  │ {name, email, pwd}  │  │ (Pydantic EmailStr, min)  │   │
  │                     │  └──────────┬───────────────┘   │
  │                     │             │ valid data         │
  │                     │  ┌──────────▼───────────────┐   │
  │                     │  │ P1.2 Check Email Unique   │──►│──► D2: users
  │                     │  └──────────┬───────────────┘   │    (SELECT)
  │                     │    exists?  │ not exists         │
  │ ◄── 400 Bad Req ────│─────────────┘                   │
  │                     │             │                    │
  │                     │  ┌──────────▼───────────────┐   │
  │                     │  │ P1.3 Hash Password       │   │
  │                     │  │ (bcrypt.hashpw + salt)   │   │
  │                     │  └──────────┬───────────────┘   │
  │                     │             │ hashed pwd         │
  │                     │  ┌──────────▼───────────────┐   │
  │                     │  │ P1.4 Create User +       │──►│──► D2: users
  │                     │  │ Default Profile          │──►│──► D3: profiles
  │                     │  └──────────┬───────────────┘   │    (INSERT)
  │                     │             │                    │
  │                     │  ┌──────────▼───────────────┐   │
  │                     │  │ P1.5 Auto-Login:         │   │
  │                     │  │ Create JWT (HS256)        │   │
  │                     │  │ exp = NOW + 24h           │   │
  │                     │  └──────────┬───────────────┘   │
  │ ◄── 201 Created ────│─────────────┘                   │
  │ {access_token}      │                                 │
                        └─────────────────────────────────┘
```

---

### 5.3.4 Level 2 — Recommendation Engine (P3 Expanded)

```
                   ┌──────────────────────────────────────────────────┐
User               │       P3: Recommendation Engine                  │
  │                │                                                  │
  │ GET /api/      │  ┌─────────────────────────────────────────┐     │
  │ recommendations│  │ P3.1: Fetch Interacted Movie IDs         │     │
  │ /for-you       │  │ SELECT movie_id FROM interactions         │──►D4
  │ ?profile_id=X  ├─►│ WHERE profile_id = X                    │     │
  │                │  └──────────────────┬──────────────────────┘     │
  │                │                     │ set of interacted_ids       │
  │                │  ┌──────────────────▼──────────────────────┐     │
  │                │  │ P3.2: Fetch Liked Interactions           │     │
  │                │  │ SELECT * FROM interactions                │──►D4
  │                │  │ WHERE profile_id = X AND action = 'like' │     │
  │                │  └──────────────────┬──────────────────────┘     │
  │                │                     │ list of liked interactions  │
  │                │  ┌──────────────────▼──────────────────────┐     │
  │                │  │ P3.3: Build Genre Weight Map             │     │
  │                │  │ For each liked interaction:              │──►D1
  │                │  │   look up movie.genre_ids               │     │
  │                │  │   genre_weight[g] += 1 for each genre   │     │
  │                │  └──────────────────┬──────────────────────┘     │
  │                │                     │ {genre_id: weight} dict     │
  │                │  ┌──────────────────▼──────────────────────┐     │
  │                │  │ P3.4: Fetch Candidate Movies             │     │
  │                │  │ SELECT * FROM movies                      │──►D1
  │                │  │ WHERE id NOT IN (interacted_ids)         │     │
  │                │  │ ORDER BY vote_average DESC               │     │
  │                │  │ LIMIT 200                                │     │
  │                │  └──────────────────┬──────────────────────┘     │
  │                │                     │ list of 200 candidates      │
  │                │  ┌──────────────────▼──────────────────────┐     │
  │                │  │ P3.5: Score Each Candidate               │     │
  │                │  │ score(m) = Σ genre_weight[g] × 10       │     │
  │                │  │         + vote_average                   │     │
  │                │  │ (for g in m.genre_ids)                   │     │
  │                │  └──────────────────┬──────────────────────┘     │
  │                │                     │ scored list                 │
  │                │  ┌──────────────────▼──────────────────────┐     │
  │                │  │ P3.6: Sort Descending by Score           │     │
  │                │  │ Return top 20 movies as MovieOut list   │     │
  │                │  └──────────────────┬──────────────────────┘     │
  │ ◄─ [MovieOut]  │                     │                             │
  │    list        │◄────────────────────┘                            │
                   └──────────────────────────────────────────────────┘
```

---

### 5.3.5 Level 2 — TMDB Data Ingestion Pipeline (P0 Expanded)

```
        TMDB API
           │
           ▼
┌──────────────────────────────────────────────────────────────────┐
│                   P0: Data Ingestion Script                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ P0.1: Fetch Movie ID Lists                               │   │
│  │ Endpoints:                                               │   │
│  │   /movie/popular       → 5 pages (~100 IDs)             │◄──┤── TMDB
│  │   /movie/top_rated     → 5 pages (~100 IDs)             │   │
│  │   /trending/movie/week → 3 pages (~60 IDs)              │   │
│  │ Combined into a SET (deduplication)                      │   │
│  └────────────────────────────────┬─────────────────────────┘   │
│                                   │ ~260 unique movie IDs        │
│  ┌────────────────────────────────▼─────────────────────────┐   │
│  │ P0.2: For each movie_id (with 3-attempt retry + backoff) │   │
│  │                                                          │◄──┤── TMDB
│  │  GET /movie/{id}           → basic metadata              │   │
│  │  GET /movie/{id}/credits   → director + top-10 cast      │   │
│  │  GET /movie/{id}/keywords  → thematic keywords list      │   │
│  │  GET /movie/{id}/videos    → YouTube trailer key         │   │
│  │                                                          │   │
│  │  Assemble enriched dict:                                 │   │
│  │  { id, title, overview, poster_path, backdrop_path,     │   │
│  │    release_date, vote_average, vote_count, runtime,     │   │
│  │    director, genre_ids (CSV), keywords (CSV),           │   │
│  │    cast_json (JSON), trailer_key, maturity_rating }     │   │
│  └────────────────────────────────┬─────────────────────────┘   │
│                                   │ enriched dict                │
│  ┌────────────────────────────────▼─────────────────────────┐   │
│  │ P0.3: Upsert to Database                                 │   │
│  │  If movie.id exists in DB → UPDATE all fields            │──►│──► movies table
│  │  If movie.id absent       → INSERT new record            │   │
│  │  Every 50 movies → db.commit() (batch write)             │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## 5.4 API Design

### 5.4.1 API Endpoint Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/signup | Register new user | No |
| POST | /api/auth/login | Login, receive JWT | No |
| GET | /api/auth/me | Get current user | Yes |
| POST | /api/auth/logout | Logout | No |
| GET | /api/movies/ | List movies (paginated, genre filter) | No |
| GET | /api/movies/search | Search movies by title | No |
| GET | /api/movies/{id} | Get single movie by ID | No |
| GET | /api/recommendations/trending | Trending movies | No |
| GET | /api/recommendations/top-rated | Top-rated movies | No |
| GET | /api/recommendations/for-you | Personalised recs | No |
| GET | /api/recommendations/similar/{id} | Similar movies | No |
| GET | /api/recommendations/rows | All browse rows | No |
| POST | /api/interactions/ | Log user interaction | No |
| GET | /api/users/{id}/watchlist | Get profile watchlist | No |
| POST | /api/users/{id}/watchlist | Add to watchlist | No |
| DELETE | /api/users/{id}/watchlist/{movie_id} | Remove from watchlist | No |
| GET | /api/users/{id}/stats | Get profile statistics | No |

### 5.4.2 Key Request/Response Schemas

**MovieOut (response schema for all movie endpoints):**

| Field | Type | Description |
|-------|------|-------------|
| id | integer | TMDB movie ID |
| title | string | Movie title |
| overview | string | Plot synopsis |
| poster_path | string | Relative path to poster image |
| backdrop_path | string | Relative path to backdrop image |
| release_date | string | YYYY-MM-DD |
| vote_average | float | Average rating (0.0 – 10.0) |
| vote_count | integer | Number of TMDB ratings |
| genre_ids | list[int] | List of genre IDs |
| runtime | int (optional) | Duration in minutes |
| director | string (optional) | Director's full name |
| cast | list[CastMember] | Top cast members |
| keywords | list[string] | Thematic keywords |
| trailer_key | string (optional) | YouTube video key |
| maturity_rating | string (optional) | e.g., "PG-13", "R" |

## 5.5 Component Design

### 5.5.1 Backend Layer Design

The backend follows a clean separation of concerns across four architectural layers:

**Layer 1 — Entry Point (`main.py`):** Creates the FastAPI application instance, registers CORS middleware with allowed origins from configuration, and includes all five API routers with their respective URL prefixes and tags.

**Layer 2 — Configuration (`core/config.py`):** Uses Pydantic `BaseSettings` to read all configuration values from environment variables or a `.env` file. This makes the application twelve-factor compliant — any deployment environment can override settings without code changes.

**Layer 3 — Data Access (`core/database.py`, `models/models.py`):** SQLAlchemy is used as the ORM. The `get_db()` dependency generator creates a new database session for each incoming request, yields it to the route handler, and closes it in a `finally` block regardless of whether the handler succeeded or raised an exception. This prevents connection leaks.

**Layer 4 — Business Logic (`api/routes/`):** Five route modules implement the business logic for each functional area. Pydantic models in `schemas/schemas.py` define the exact structure of every request body and response body, with automatic validation and serialisation handled by FastAPI.

**Security Layer (`core/security.py`):** `hash_password()` uses `bcrypt.hashpw()` with an automatically generated salt. `verify_password()` uses `bcrypt.checkpw()`. `create_access_token()` encodes a payload with an expiry timestamp using `python-jose`'s `jwt.encode()`. `decode_token()` validates the signature and expiry, raising HTTP 401 on failure.

### 5.5.2 Frontend Component Hierarchy

```
App (layout.tsx)
└── AuthProvider (AuthContext.tsx)
    ├── LandingPage (app/page.tsx)
    │   ├── NavBar (inline)
    │   ├── HeroSection (inline)
    │   ├── FeaturesSection (inline)
    │   ├── CTASection (inline)
    │   └── Footer (components/layout/Footer.tsx)
    │
    ├── AuthPages (app/(auth)/login, signup)
    │   └── AuthForm (components/auth/AuthForm.tsx)
    │
    └── MainApp (app/(main)/layout.tsx)
        ├── AppShell (components/layout/AppShell.tsx)
        │   └── Navbar (components/layout/Navbar.tsx)
        │       ├── SearchBar (components/search/SearchBar.tsx)
        │       └── ProfileMenu
        │
        ├── BrowsePage
        │   └── BrowseClient
        │       ├── HeroBanner (components/movie/HeroBanner.tsx)
        │       └── MovieRow[] (components/movie/MovieRow.tsx)
        │           └── MovieCard (components/movie/MovieCard.tsx)
        │
        ├── MovieDetailPage
        │   └── MovieDetailClient
        │       ├── BackdropHero
        │       ├── MovieMeta (components/movie/MovieMeta.tsx)
        │       ├── ActionButtons (Like, Dislike, MyList, Play)
        │       ├── CommunityScore
        │       └── SimilarMoviesRow
        │
        ├── SearchPage
        │   ├── SearchBar
        │   ├── GenreFilter (components/search/GenreFilter.tsx)
        │   └── MovieGrid
        │
        └── MyListPage
            └── MovieCard[]
```

### 5.5.3 State Management Design

NFLIX uses React Context API for global state management rather than a third-party library like Redux. The `AuthContext` is the single source of truth for:
- The authenticated user object (including all profiles)
- The active profile selection
- The watchlist (`myList` — full Movie objects)
- Liked movie IDs (`likedMovies`)
- Disliked movie IDs (`dislikedMovies`)
- Auth state (`isAuthenticated`, `isLoading`)

All mutation operations (login, signup, logout, addToMyList, toggleLike, etc.) are `useCallback` memoised to prevent unnecessary re-renders.

Persistence follows a two-layer strategy:
1. **Primary:** Backend database (interactions table for likes/dislikes, watchlist table for saved movies)
2. **Fallback:** `localStorage` keyed by profile ID (`nflix_state_{profileId}`) — restores state instantly on page reload and functions when the backend is temporarily unavailable

---

---

# 6. Hardware/Software Platform Environment

## 6.1 Development Hardware

The project was developed and tested on a system with the following hardware configuration:

| Component | Specification |
|-----------|--------------|
| Operating System | Windows 11 Home (64-bit) |
| Processor | Intel Core i7 / AMD Ryzen 7 equivalent |
| RAM | 16 GB DDR4 |
| Storage | 512 GB SSD (NVMe) |
| Display | 1920×1080 (Full HD) |
| Network | Broadband internet (required for TMDB API calls during ingestion) |

**Minimum Hardware for Running the Project:**

| Component | Minimum Requirement |
|-----------|-------------------|
| Processor | Dual-core 2.0 GHz |
| RAM | 4 GB |
| Storage | 5 GB free (Python venv + Node modules + DB) |
| Network | Stable internet connection |

## 6.2 Backend Software Stack

### 6.2.1 Runtime Environment

| Software | Version | Role |
|----------|---------|------|
| Python | 3.10+ | Primary programming language |
| pip | 23.x | Package installer |
| venv | (stdlib) | Isolated virtual environment |

### 6.2.2 Core Backend Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| FastAPI | 0.115.0+ | Web framework for building REST APIs |
| Uvicorn (standard) | 0.29.0 | ASGI server — runs FastAPI |
| Pydantic | 2.10.0+ | Data validation and serialisation |
| pydantic-settings | 2.6.0+ | Environment variable configuration management |
| SQLAlchemy | 2.0.36+ | ORM for database access |
| psycopg2-binary | 2.9.10+ | PostgreSQL database driver for Python |
| Alembic | 1.13.1 | Database schema migration tool |
| python-jose | 3.3.0 | JWT creation and verification (HS256) |
| bcrypt | 4.0.1 | Password hashing |
| python-multipart | 0.0.9 | Multipart form data parsing |
| requests | 2.31.0 | HTTP client for TMDB API calls in ingestion script |

### 6.2.3 Planned Phase 2 and Phase 3 Libraries (Commented in requirements.txt)

| Library | Version | Activation Phase | Purpose |
|---------|---------|------------------|---------|
| scikit-learn | 1.4.2 | Phase 2 | TF-IDF vectorisation and cosine similarity |
| numpy | 1.26.4 | Phase 2 | Numerical array operations |
| scikit-surprise | 1.1.3 | Phase 3 | Matrix factorisation (SVD) for collaborative filtering |
| lightfm | 1.17 | Phase 3 | Hybrid CF + content recommendation |

## 6.3 Frontend Software Stack

### 6.3.1 Runtime Environment

| Software | Version | Role |
|----------|---------|------|
| Node.js | 18.x or later | JavaScript runtime |
| npm | 9.x+ | Package manager |

### 6.3.2 Core Frontend Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.2.6 | Full-stack React framework (App Router) |
| React | 19.2.4 | UI component library |
| React DOM | 19.2.4 | DOM rendering for React |
| TypeScript | 5.x | Type-safe JavaScript superset |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Framer Motion | 12.38.0 | Declarative animation library |
| Lucide React | 1.14.0 | SVG icon library |
| clsx | 2.1.1 | Conditional className utility |
| tailwind-merge | 3.6.0 | Merge Tailwind class strings without conflicts |

### 6.3.3 Development Dependencies

| Tool | Version | Purpose |
|------|---------|---------|
| @tailwindcss/postcss | 4.x | PostCSS integration for Tailwind |
| @types/node | 20.x | TypeScript type definitions for Node.js |
| @types/react | 19.x | TypeScript type definitions for React |
| ESLint | 9.x | JavaScript/TypeScript linting |
| eslint-config-next | 16.2.6 | Next.js-specific ESLint rules |

## 6.4 Database Platform

| Property | Detail |
|----------|--------|
| Database Engine | PostgreSQL 15.x |
| Cloud Provider | Neon (serverless PostgreSQL) |
| ORM | SQLAlchemy 2.0 (Declarative API) |
| Migration Tool | Alembic 1.13.1 |
| Connection Pooling | SQLAlchemy built-in pool with `pool_pre_ping=True` |
| Session Strategy | Request-scoped sessions via FastAPI dependency injection |

### 6.4.1 Database Configuration

The database connection is configured via the `DATABASE_URL` environment variable. SQLAlchemy's `pool_pre_ping=True` setting sends a lightweight "ping" query before each connection is used from the pool, automatically recovering from stale connections — essential for serverless environments like Neon where connections may be closed by the cloud provider after a period of inactivity.

## 6.5 External APIs and Services

| Service | URL | Purpose | Authentication |
|---------|-----|---------|---------------|
| TMDB API | api.themoviedb.org/3 | Movie metadata source | API key (query param) |
| TMDB Image CDN | image.tmdb.org/t/p | Movie poster and backdrop images | Public (no auth) |
| YouTube | youtube.com/embed | Movie trailer embedding | Public (no auth) |
| Neon PostgreSQL | *.neon.tech | Cloud database hosting | Connection string |
| Vercel | vercel.com | Frontend hosting | GitHub OAuth |
| Railway | railway.app | Backend hosting | GitHub OAuth |

## 6.6 Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Visual Studio Code | Latest | Primary code editor |
| Git | 2.x | Version control |
| Postman | Latest | API endpoint testing |
| FastAPI Swagger UI | Auto-generated | Interactive API documentation at /docs |
| FastAPI ReDoc | Auto-generated | Alternative API documentation at /redoc |
| pgAdmin 4 | 7.x | PostgreSQL GUI client for database inspection |
| Chrome DevTools | Built-in | Frontend debugging and network monitoring |

## 6.7 Environment Configuration Files

### 6.7.1 Backend `.env`

```
DATABASE_URL=postgresql://user:password@neon.host/nflix_db
SECRET_KEY=your-256-bit-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
TMDB_API_KEY=your-tmdb-api-key-from-developer-portal
TMDB_BASE_URL=https://api.themoviedb.org/3
ALLOWED_ORIGINS=["http://localhost:3000","https://your-vercel-app.vercel.app"]
```

### 6.7.2 Frontend `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 6.8 Project Setup Instructions

### 6.8.1 Backend Setup

1. Navigate to the `backend/` directory.
2. Create a Python virtual environment: `python -m venv venv`
3. Activate the virtual environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/macOS)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and fill in the required values.
6. Initialise the database tables: `python -m scripts.init_db`
7. Run the TMDB ingestion script: `python -m scripts.ingest_tmdb`
8. Start the backend server: `uvicorn app.main:app --reload`
9. Access the Swagger API documentation at `http://localhost:8000/docs`

### 6.8.2 Frontend Setup

1. Navigate to the `frontend/` directory.
2. Install Node.js dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_URL=http://localhost:8000`
4. Start the development server: `npm run dev`
5. Open `http://localhost:3000` in a web browser

---

---

# 7. Snapshots of Input & Output

> **Note to student:** Please insert actual screenshots of the running application in this section. The following subsections describe the key screens to be captured. Each screen should be photographed or screen-captured at full resolution and inserted as an image. Below each screenshot, include a brief caption describing what the screen shows and what inputs/outputs are visible.

---

### 7.1 Landing Page (Home Screen)

*(Insert screenshot here — approximately 1 full page)*

**Description:** The application's landing page as seen by a guest (unauthenticated) user. The screen features the NFLIX logo in red in the top-left corner, with "Sign In" and "Get Started" buttons in the top-right navigation bar. The hero section displays the headline "Find Movies You'll Love" over a semi-transparent background collage of movie backdrop images. Two call-to-action buttons are visible: "Start Watching" (red, filled) and "Browse Movies" (semi-transparent). Below the hero, three feature cards describe Personalised Recommendations, Watchlist, and Rate & Discover.

**Input:** None (static landing page)
**Output:** Full-screen hero section with feature highlights

---

### 7.2 Sign-Up / Registration Page

*(Insert screenshot here — approximately 0.5 pages)*

**Description:** The registration form page. A centered card on a dark background contains input fields for Full Name, Email Address, and Password. A "Create Account" button submits the form. A link to the login page is shown below for existing users.

**Input:** User's full name, email address, and password
**Output:** On success: redirect to /browse with authenticated session. On error: inline validation messages.

---

### 7.3 Login Page

*(Insert screenshot here — approximately 0.5 pages)*

**Description:** The login form page, similar in design to the sign-up page. Contains fields for Email Address and Password, and a "Sign In" button. A link to the sign-up page is shown for new users.

**Input:** Registered email address and password
**Output:** JWT token stored in localStorage; user redirected to /browse

---

### 7.4 Browse Page — Full View

*(Insert screenshot here — approximately 1 full page)*

**Description:** The main Browse page visible to an authenticated user. The top of the screen shows a large Hero Banner featuring a featured movie with its title, overview snippet, and a "Play" and "My List" button. Below the hero, multiple horizontally scrollable rows are visible:
- Row 1: "Recommended For You" (personalised based on liked genres)
- Row 2: "Because you liked [Movie Title]"
- Row 3: "Trending Now"
- Row 4: "Top Rated"
- Row 5: "Action"
- Row 6: "Sci-Fi"

Each row contains movie cards showing the movie poster, and hovering reveals the title and rating.

**Input:** Active profile ID (sent automatically from AuthContext)
**Output:** Personalised rows of movie recommendations

---

### 7.5 Movie Detail Page

*(Insert screenshot here — approximately 1 full page)*

**Description:** The detail page for a specific movie (e.g., Inception). The top portion shows a full-width backdrop image with a gradient overlay. Below, the movie poster is displayed alongside the title, meta information (year, runtime, maturity rating, director), genre tags, and the full synopsis. Action buttons (Play, My List, Like, Dislike) are shown in a horizontal row. A "Community Score" bar visualises the vote_average as a percentage. At the bottom, a "Similar Movies" horizontal row displays genre-matched recommendations.

**Input:** Movie ID (from URL path parameter)
**Output:** Full movie metadata; community score; similar movie recommendations

---

### 7.6 Search Page

*(Insert screenshot here — approximately 0.5 pages)*

**Description:** The search page with genre filter chips across the top (All, Action, Comedy, Drama, etc.) and a search input field. Below the filters, a grid of movie cards shows the current results. If a genre chip is selected, only movies of that genre are shown. If a text query is entered, movies matching the title are shown.

**Input:** Search query text and/or selected genre filter
**Output:** Filtered movie grid updated in real time

---

### 7.7 My List Page

*(Insert screenshot here — approximately 0.5 pages)*

**Description:** The user's saved watchlist page. Displays all movies the user has added to their list in a grid layout. If the list is empty, an empty state message and link to Browse is shown.

**Input:** No direct input (loaded from auth state and backend watchlist)
**Output:** Grid of saved movies with Remove option

---

---

# 8. Coding

## 8.1 Development Methodology

The project was developed using a feature-driven, iterative approach. Development proceeded in the following phases:

**Phase 1 — Schema and Data:** The database schema was designed first, ensuring all entities and their relationships were clearly defined before any business logic was written. This was followed by implementation of the TMDB ingestion script to populate the database with real movie data, allowing all subsequent development to work with realistic content.

**Phase 2 — Backend API:** API routes were implemented in dependency order: core utilities (config, database, security) first, then models, then schemas, then route handlers. Each route was tested independently using FastAPI's built-in Swagger UI before moving to the next.

**Phase 3 — Frontend:** Frontend pages were built after the corresponding backend APIs were stable and tested. The AuthContext was implemented first (as it underpins all authenticated functionality), followed by the Browse page, movie detail page, search page, and finally the profile management and watchlist pages.

**Phase 4 — Integration and Polish:** The frontend and backend were connected end-to-end, with any mismatch in API contracts resolved. Animations, responsive layouts, and edge-case handling (empty states, loading states, error states) were added in this phase.

## 8.2 Key Implementation Modules

### 8.2.1 Database Connection and Session Management

The database connection is managed by SQLAlchemy in `app/core/database.py`. A single engine is created at application startup with `pool_pre_ping=True` to handle stale connections gracefully. The `get_db()` function is a Python generator that:
1. Creates a new database session (`SessionLocal()`)
2. Yields it to the route handler via FastAPI's `Depends()` mechanism
3. Closes the session in a `finally` block, ensuring closure even if the handler raises an exception

This pattern is standard in FastAPI applications and prevents the resource leak that would occur if sessions were not explicitly closed. Each HTTP request receives its own independent session, ensuring transactional isolation.

### 8.2.2 Configuration Management

The `Settings` class in `app/core/config.py` extends Pydantic's `BaseSettings`. Pydantic `BaseSettings` automatically reads values from environment variables and `.env` files, with type validation and default values. This approach has several advantages:
- **Security:** Secrets (database URL, JWT secret, TMDB API key) are never hardcoded in source code.
- **Flexibility:** Any deployment environment can override settings without code changes.
- **Validation:** Pydantic validates that all required settings are present and correctly typed at startup, failing fast if misconfigured rather than failing later during a request.

The settings object is instantiated once at module load time (`settings = Settings()`) and imported wherever configuration values are needed.

### 8.2.3 Authentication Implementation

Security is implemented in `app/core/security.py` with three core functions:

**Password Hashing:** `hash_password(plain: str) -> str` uses `bcrypt.hashpw()` with `bcrypt.gensalt()` to generate a cryptographically random salt and compute the hash. bcrypt's work factor (by default 12 rounds) makes the hash computationally expensive to compute, significantly slowing brute-force attacks. The hash and salt are stored together in the returned string.

**Password Verification:** `verify_password(plain: str, hashed: str) -> bool` uses `bcrypt.checkpw()` which extracts the salt from the stored hash and recomputes the hash of the submitted password for comparison. This correctly handles the timing-safe comparison required to prevent timing attacks.

**JWT Creation:** `create_access_token(data: dict) -> str` encodes the provided data (including the user's ID as the `sub` claim) along with an expiry timestamp (`exp`) using the HS256 algorithm and the application's secret key. The resulting token is a three-part Base64-encoded string (header.payload.signature).

**JWT Decoding:** `decode_token(token: str) -> dict` verifies the token's signature and expiry using `python-jose`. If the signature is invalid or the token has expired, a `JWTError` is raised and caught, returning an HTTP 401 response.

The `get_current_user()` dependency in `auth.py` wires these together: it extracts the Bearer token from the `Authorization` header, decodes it to get the user ID, queries the database for the corresponding User record, and returns it. Any route that includes `current_user: User = Depends(get_current_user)` in its parameters is automatically protected.

### 8.2.4 Pydantic Schema Layer

The `schemas/schemas.py` file defines Pydantic models that serve as the contract between the API and its consumers. FastAPI uses these models to:
- **Deserialise and validate request bodies:** Incoming JSON is automatically parsed and validated against the model. Invalid data triggers a 422 Unprocessable Entity response with detailed error messages.
- **Serialise response bodies:** The route handler can return an ORM object, and FastAPI will automatically convert it to the response schema, filtering out any fields not defined in the schema (preventing accidental data leaks).

A notable implementation detail is the `parse_favorite_genres` field validator on `ProfileOut`. The database stores genre IDs as a comma-separated string (e.g., `"28,12,878"`) because PostgreSQL ARRAY types are not portable across all database drivers. The validator transparently converts this string into a proper Python list of integers for the API consumer, hiding the implementation detail of the storage format.

### 8.2.5 Recommendation Engine Implementation

The recommendation engine in `app/api/routes/recommendations.py` is the intellectual core of the project. The implementation deserves detailed examination:

**Trending Algorithm:**
The trending score formula is `vote_average × log(vote_count + 1)`. The rationale for this specific formula is that raw `vote_count` grows without a meaningful ceiling (a movie with 10,000 ratings is not necessarily 10× better than one with 1,000 ratings), so a logarithmic transformation compresses the range while still rewarding popularity. Multiplying by `vote_average` ensures that only well-rated popular movies appear at the top — a movie with 10,000 ratings but a 3.0 average will not outrank a movie with 2,000 ratings and an 8.5 average. This is mathematically analogous to the Bayesian average used by IMDB's "Top 250" list.

**Content-Based Similar Movies:**
The genre overlap scoring counts the number of genre IDs shared between the target movie and each candidate movie. This is computed as a Python set intersection: `len(target_genres & m_genres)`. The result is a non-negative integer representing the strength of the genre relationship. Movies with higher overlap are considered more similar. The `vote_average` is used as a tiebreaker among movies with equal overlap scores.

This is a deliberately simplified version of content-based filtering. The Phase 2 upgrade replaces this with TF-IDF cosine similarity on the `keywords` field, which captures thematic similarity more precisely than genre overlap. For example, two Action films might be thematically very different (a superhero film vs. a war film), but their keyword sets would correctly place them apart.

**For-You Personalisation:**
The personalisation algorithm builds a genre preference vector from the profile's interaction history:
1. Fetch all `like` interactions for the profile
2. For each liked movie, fetch its `genre_ids`
3. Increment a counter for each genre: `genre_weight[genre_id] += 1`
4. The result is a dictionary mapping genre IDs to the number of liked movies in that genre

This genre weight map is then used to score candidate movies. A candidate movie earns points for each of its genres proportional to how much the user has demonstrated interest in that genre. The ×10 multiplier on the genre score relative to the `vote_average` (range 0–10) ensures that genre preference is the dominant factor in ranking.

The system excludes movies the profile has already interacted with (any action type) from the candidate set. This ensures that liked, disliked, and previously clicked movies do not reappear as recommendations — a critical requirement for a useful recommendation system.

### 8.2.6 Interaction Logging

The `/api/interactions` endpoint in `interactions.py` is the data collection backbone of the system. Every meaningful user action is funnelled through this endpoint, creating a timestamped record in the `interactions` table. The six supported action types form a deliberate vocabulary:

- `like` and `dislike` — explicit feedback signals, the strongest indicators of preference
- `watchlist_add` and `watchlist_remove` — implicit positive signal (adding) and revocation (removing)
- `click` — implicit weak signal (user was interested enough to view the detail page)
- `watch` — the strongest implicit signal, currently a placeholder for when video playback tracking is implemented

The interaction log has a dual purpose: it feeds the recommendation engine in real time (the For-You algorithm reads it on every request) and accumulates the training data for future Phase 3 collaborative filtering models.

A critical edge case is handled in the watchlist synchronisation: when `watchlist_add` is received, the endpoint checks for an existing `WatchlistItem` before inserting to prevent duplicates. Even with this check, a race condition exists where two concurrent requests could both pass the check before either has committed. This is handled by catching the `IntegrityError` that would result from the database's unique constraint violation, rolling back the failed transaction, and continuing normally.

### 8.2.7 Frontend API Client

The `lib/api.ts` file implements a typed HTTP client used throughout the frontend. It provides `get<T>()` and `post<T>()` methods that:
1. Construct the full URL from the configured base URL
2. Set appropriate Content-Type and Authorization headers
3. Make the `fetch()` call
4. Check the response status code and throw a descriptive error on failure
5. Return the parsed JSON response typed as `T`

This centralised client ensures consistent error handling and header management across all API calls, and makes the backend URL configurable via environment variable rather than hardcoded.

### 8.2.8 Multi-Profile State Management

The `AuthContext` manages the complexity of multi-profile state persistence using a two-layer strategy. When a profile is selected or switched:

1. The `activeProfileId` derived value (computed from `user.active_profile?.id ?? user.profiles?.[0]?.id`) changes.
2. A `useEffect` watching `activeProfileId` fires, loading persisted state from `localStorage` for the new profile.
3. The watchlist is restored from the backend (if online) or from the saved `myListIds` array (if offline).
4. A separate `useEffect` watching `likedMovies`, `dislikedMovies`, and `myList` persists any state changes back to `localStorage`.

This design ensures that switching profiles immediately reflects the new profile's saved state without requiring a full page reload, while also ensuring persistence across browser sessions.

### 8.2.9 Search with Debouncing

The `useSearch` hook in `hooks/useSearch.ts` implements the classic debouncing pattern for search input. Without debouncing, every keystroke would trigger an API call, potentially making hundreds of requests per second for a fast typist. The `useEffect` watching `query` and `genreId` creates a `setTimeout` for 300ms and returns a cleanup function that calls `clearTimeout`. When the user types another character within 300ms of the previous one, the cleanup function cancels the previous timer and a new one is set. Only when the user pauses for 300ms does the API call actually execute.

This technique dramatically reduces API load while maintaining a responsive feel from the user's perspective.

### 8.2.10 TMDB Image URL Construction

TMDB stores image paths as relative strings (e.g., `/xy1cMFSgkOPe7KRgkRQKKMNgjeV.jpg`). The full URL is constructed using TMDB's image CDN at `image.tmdb.org/t/p/`, with a size parameter specifying the desired image resolution. The `lib/tmdb-image.ts` utility provides two functions:

- `getPosterUrl(path, size)` — constructs a poster URL (default size: `w500`)
- `getBackdropUrl(path, size)` — constructs a backdrop URL (default size: `w1280`)

These functions also handle the case where the `path` is empty or null, returning a placeholder image URL to prevent broken images in the UI.

---

---

# 9. Project Limitation and Future Scope

## 9.1 Current Limitations

### 9.1.1 Phase 1 Recommendation Quality

The most significant limitation of the current implementation is the maturity of the recommendation engine. Phase 1 uses heuristic scoring based on genre preferences, which is a functional but coarse approximation of true personalisation:

**Genre-Level Granularity:** The system treats all "Action" movies as equally relevant to a user who likes Action. In reality, a user might prefer gritty realistic action thrillers (e.g., The Dark Knight) over cartoonish superhero action (e.g., Guardians of the Galaxy), but both would receive the same genre-weight score. TF-IDF keyword similarity (Phase 2) would capture this distinction through thematic keywords like "crime", "heist", "superhero", "space opera".

**No Temporal Weighting:** The genre weight map gives equal weight to a movie liked three years ago and one liked yesterday. Real recommendation systems apply exponential decay to older interactions, gradually reducing their influence on recommendations so that the system adapts to evolving tastes.

**No Cross-User Learning:** Phase 1 is entirely profile-specific; it does not benefit from the collective intelligence of all users. If a thousand users who liked "Inception" subsequently liked "Interstellar", a Phase 1 system cannot leverage this signal for a new user who just liked "Inception". Collaborative filtering (Phase 3) addresses this.

### 9.1.2 Cold Start Problem

New users and new profiles receive entirely generic recommendations (Trending, Top Rated) because there is no interaction history to personalise from. This is the classic cold-start problem. Several mitigation strategies exist but are not yet implemented:
- **Onboarding survey:** Ask new users to select their favourite genres during sign-up and seed initial genre weights from their selections. The `favorite_genres` field on the `Profile` model was designed with this in mind.
- **Popularity-based seeding:** Recommend the most universally liked movies until sufficient personal data is available.
- **Demographic-based filtering:** Use age group, language, or region to make initial recommendations (requires demographic data collection).

### 9.1.3 Search Limitations

The current search implementation uses a simple SQL `ILIKE` (case-insensitive LIKE) query on the movie title field. This means:
- Searching for "Al Pacino" returns no results (no actor-name search)
- Searching for "Christopher Nolan" returns no results (no director search)
- Searching for "time travel" returns no results (no keyword or overview search)
- Misspelled queries (e.g., "Inceptoin") return no results (no fuzzy matching)

A production-grade search implementation would use PostgreSQL's full-text search capabilities (`tsvector` + `tsquery`) across title, overview, keywords, director, and cast fields, with `pg_trgm` for fuzzy matching.

### 9.1.4 No Video Playback

NFLIX is a discovery and recommendation platform, not a streaming platform. The "Play" button on the movie detail page opens the TMDB trailer (YouTube) rather than streaming the actual film. Building a legal video streaming system requires content licensing agreements with studios, which is entirely outside the scope of an academic project. This limitation should be clearly understood: the project demonstrates the recommendation and discovery layer of a streaming service, not the streaming layer itself.

### 9.1.5 No Email Verification or Password Reset

The authentication system does not include email verification on registration or password reset via email. These features require integration with an email delivery service (e.g., SendGrid, AWS SES, Mailgun) and an additional flow involving time-limited verification tokens. They are standard requirements for production authentication systems but were deferred as non-essential for this demonstration.

### 9.1.6 Limited Maturity Filtering

The `maturity_level` field on Profile and `maturity_rating` on Movie were designed to support content filtering (e.g., restricting a child's profile to G and PG-rated movies). However, the filtering is not applied in any API endpoint query at present. The TMDB API also does not consistently provide certification data for all movies (the `maturity_rating` field defaults to "PG-13" in the ingestion script, rather than the actual certification which varies by country). Implementing this correctly would require querying TMDB's `/movie/{id}/release_dates` endpoint and selecting the appropriate country's certification.

### 9.1.7 Data Freshness

The TMDB ingestion script must be run manually (or scheduled as a cron job) to update the movie catalogue. There is no automated webhook or event-driven refresh mechanism. A newly released film will not appear in the system until the next ingestion run. For a production system, the ingestion would be scheduled to run at regular intervals (e.g., daily) using a task scheduler such as Celery, APScheduler, or a cloud-native scheduler.

### 9.1.8 Interaction Volume Dependency

The quality of personalised recommendations improves with the volume of interaction data. A user who has liked only two movies will receive only marginally personalised recommendations compared to a user with a history of fifty liked movies. In a demonstration context with a small user base, this limitation is particularly visible. The system is designed for scale — it will improve naturally as interaction data accumulates — but the initial experience may feel only slightly personalised.

## 9.2 Future Scope

### 9.2.1 Phase 2 — Content-Based Filtering with TF-IDF

The most immediately actionable enhancement is activating the TF-IDF content-based filtering that is already scaffolded in the codebase. The implementation involves:

1. Uncommenting the scikit-learn imports and TF-IDF block in the `/similar/{movie_id}` route
2. Adding `scikit-learn` and `numpy` to `requirements.txt`
3. Running `pip install scikit-learn numpy`

When activated, the system will:
- Build a TF-IDF matrix from the `keywords` field of all movies in the database
- For each similarity query, compute cosine similarity between the target movie's TF-IDF vector and all other movies' vectors
- Return movies sorted by cosine similarity score rather than genre overlap count

This change requires no database schema changes and no frontend modifications, demonstrating the value of the phased architecture.

**Expected improvement:** The "Similar Movies" section on movie detail pages will show more thematically relevant recommendations. For example, similar movies to "Inception" would include other mind-bending psychological thrillers with keywords like "dream", "subconscious", "heist" rather than simply other Action/Thriller/Sci-Fi films.

### 9.2.2 Phase 3 — Collaborative Filtering

Once the user base has generated tens of thousands of interaction records, matrix factorisation collaborative filtering can be implemented:

**Data Preparation:**
- Export the `interactions` table as a user-item matrix where `profile_id` is the user dimension, `movie_id` is the item dimension, and interaction types are encoded as numeric signals (like=1.0, dislike=-1.0, watchlist_add=0.5, click=0.1)

**Model Training:**
- Use `scikit-surprise`'s SVD implementation to factorise the matrix into user and item latent factor matrices
- Train offline (nightly batch job), storing predicted ratings for all user-item pairs

**Integration:**
- Pre-compute top-N recommendations for each profile and store in a `recommendations` cache table
- The `/for-you` endpoint queries this cache instead of computing in real time
- The cache is invalidated and recomputed when significant new interaction data arrives

**Expected improvement:** The system can discover non-obvious preference patterns. A user who likes science fiction may also enjoy philosophical dramas if users with similar sci-fi tastes also tend to like philosophical dramas — a connection that genre-based Phase 1 recommendations cannot make.

### 9.2.3 Full-Text Search Enhancement

Replace the current `ILIKE` title search with a comprehensive full-text search using:
- **PostgreSQL `tsvector` and `tsquery`:** Create a searchable text column combining title, overview, director, cast names, and keywords. PostgreSQL's GIN index on this column makes full-text queries fast even on large datasets.
- **`pg_trgm` extension:** Add trigram-based fuzzy matching to tolerate misspellings ("Inceptoin" → "Inception").
- **Elasticsearch (advanced):** For a production system, a dedicated search service like Elasticsearch or Typesense would offer superior search quality, including semantic search using embedding vectors.

### 9.2.4 Advanced Personalisation Features

- **Onboarding Genre Survey:** After registration, show a genre selection screen ("What do you like?") and use the selections to pre-populate genre weights before any interactions occur, solving the cold-start problem.
- **Temporal Decay:** Apply exponential decay to older interactions when computing genre weights, so that recently liked movies have more influence on recommendations than movies liked months ago.
- **Negative Feedback:** Currently, `dislike` interactions do not explicitly reduce the recommendation score for similar movies. Implementing negative weighting would further personalise recommendations.
- **Watch History Tracking:** Log time-based watching events (e.g., "watched 80% of this movie") as implicit positive feedback signals stronger than a click but weaker than an explicit like.

### 9.2.5 Email Verification and Account Security

- **Email verification on signup:** Send a verification email with a time-limited token. Require email verification before the account can access personalised features.
- **Password reset flow:** Allow users to request a password reset link sent to their registered email address.
- **Two-factor authentication:** Add TOTP-based 2FA for enhanced account security.
- **OAuth integration:** Allow sign-in with Google, GitHub, or Apple accounts using OAuth 2.0 / OpenID Connect.

### 9.2.6 Progressive Web App (PWA)

Convert the Next.js frontend into a Progressive Web App by adding:
- A Web App Manifest (`manifest.json`) defining the app's name, icons, and theme colour
- A Service Worker for offline caching of the shell UI and the user's watchlist
- Push notification capabilities for new releases in the user's favourite genres

PWA support would allow users to "install" NFLIX on their devices (desktop or mobile) and access it offline with a native app-like experience.

### 9.2.7 Social and Community Features

- **Following users:** Allow users to follow friends and see what they're watching or saving to their lists.
- **Shareable watchlists:** Generate a public URL for any user's watchlist that can be shared with others.
- **Movie reviews and ratings:** Allow users to write text reviews and assign star ratings, adding an editorial layer on top of the algorithmic recommendations.
- **Community lists:** Curated lists created by the community (e.g., "Best Films of the 2000s", "Underrated Sci-Fi Gems").

### 9.2.8 API Enhancements

- **Pagination cursor-based:** Replace offset-based pagination with cursor-based pagination for more efficient retrieval of large result sets.
- **GraphQL API:** Offer a GraphQL endpoint alongside the REST API, allowing frontend clients to request exactly the fields they need, reducing over-fetching.
- **WebSocket support:** Push real-time updates (e.g., new movie releases in followed genres) to connected clients using WebSocket connections.
- **Rate limiting and throttling:** Add request rate limiting per IP address and per authenticated user to prevent API abuse.

### 9.2.9 A/B Testing Framework

For a production system with multiple recommendation algorithms, A/B testing is essential for determining which algorithm drives more user engagement. Implement a lightweight feature flag system that:
- Routes a configurable percentage of users to "Algorithm A" (current Phase 1 heuristics)
- Routes the remaining users to "Algorithm B" (Phase 2 TF-IDF or Phase 3 CF)
- Logs engagement metrics (click-through rate, watchlist additions, watch-through rate) for each group
- Provides an analytics dashboard comparing algorithm performance

---

---

# 10. References

## 10.1 Foundational Academic Papers

1. Goldberg, D., Nichols, D., Oki, B. M., & Terry, D. (1992). *Using collaborative filtering to weave an information tapestry.* Communications of the ACM, 35(12), 61–70. https://doi.org/10.1145/138859.138867

2. Resnick, P., Iacovou, N., Suchak, M., Bergstrom, P., & Riedl, J. (1994). *GroupLens: An open architecture for collaborative filtering of netnews.* Proceedings of the 1994 ACM Conference on Computer Supported Cooperative Work, 175–186.

3. Breese, J. S., Heckerman, D., & Kadie, C. (1998). *Empirical analysis of predictive algorithms for collaborative filtering.* Proceedings of the Fourteenth Conference on Uncertainty in Artificial Intelligence (UAI-98), 43–52.

4. Sarwar, B., Karypis, G., Konstan, J., & Riedl, J. (2001). *Item-based collaborative filtering recommendation algorithms.* Proceedings of the 10th International Conference on World Wide Web (WWW 2001), 285–295. https://doi.org/10.1145/371920.372071

5. Linden, G., Smith, B., & York, J. (2003). *Amazon.com recommendations: Item-to-item collaborative filtering.* IEEE Internet Computing, 7(1), 76–80. https://doi.org/10.1109/MIC.2003.1167344

6. Koren, Y. (2008). *Factorization meets the neighborhood: A multifaceted collaborative filtering model.* Proceedings of the 14th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, 426–434.

7. Koren, Y., Bell, R., & Volinsky, C. (2009). *Matrix factorization techniques for recommender systems.* Computer, 42(8), 30–37. https://doi.org/10.1109/MC.2009.263

8. Pazzani, M. J., & Billsus, D. (2007). *Content-based recommendation systems.* In P. Brusilovsky, A. Kobsa, & W. Nejdl (Eds.), The Adaptive Web: Methods and Strategies of Web Personalization (pp. 325–341). Springer, Berlin, Heidelberg.

9. Burke, R. (2002). *Hybrid recommender systems: Survey and experiments.* User Modeling and User-Adapted Interaction, 12(4), 331–370.

10. Gomez-Uribe, C. A., & Hunt, N. (2015). *The Netflix recommender system: Algorithms, business value, and innovation.* ACM Transactions on Management Information Systems (TMIS), 6(4), 1–19. https://doi.org/10.1145/2843948

11. McNee, S. M., Riedl, J., & Konstan, J. A. (2006). *Being accurate is not enough: How accuracy metrics have hurt recommender systems.* CHI 2006 Extended Abstracts on Human Factors in Computing Systems, 1097–1101.

12. Schwartz, B. (2004). *The Paradox of Choice: Why More Is Less.* Harper Collins Publishers.

13. Ricci, F., Rokach, L., & Shapira, B. (2011). *Introduction to recommender systems handbook.* In F. Ricci, L. Rokach, B. Shapira, & P. B. Kantor (Eds.), Recommender Systems Handbook (pp. 1–35). Springer.

14. Salakhutdinov, R., Mnih, A., & Hinton, G. (2007). *Restricted Boltzmann machines for collaborative filtering.* Proceedings of the 24th International Conference on Machine Learning (ICML 2007), 791–798.

15. Su, X., & Khoshgoftaar, T. M. (2009). *A survey of collaborative filtering techniques.* Advances in Artificial Intelligence, 2009, Article 421425. https://doi.org/10.1155/2009/421425

16. Lü, L., Medo, M., Yeung, C. H., Zhang, Y. C., Zhang, Z. K., & Zhou, T. (2012). *Recommender systems.* Physics Reports, 519(1), 1–49. https://doi.org/10.1016/j.physrep.2012.02.006

17. He, X., Liao, L., Zhang, H., Nie, L., Hu, X., & Chua, T. S. (2017). *Neural collaborative filtering.* Proceedings of the 26th International Conference on World Wide Web (WWW 2017), 173–182.

## 10.2 Framework and Library Documentation

18. FastAPI. (2024). *FastAPI — Modern, fast (high-performance) web framework for building APIs with Python.* https://fastapi.tiangolo.com/

19. Tiangolo, S. R. (2024). *FastAPI — Bigger Applications — Multiple Files.* https://fastapi.tiangolo.com/tutorial/bigger-applications/

20. Next.js. (2024). *Next.js Documentation — The React Framework for the Web.* https://nextjs.org/docs

21. React. (2024). *React — A JavaScript library for building user interfaces.* https://react.dev/

22. SQLAlchemy. (2024). *SQLAlchemy 2.0 Documentation.* https://docs.sqlalchemy.org/en/20/

23. Pydantic. (2024). *Pydantic V2 Documentation — Data validation using Python type annotations.* https://docs.pydantic.dev/latest/

24. Scikit-learn. (2024). *Scikit-learn: Machine Learning in Python — TF-IDF Vectorizer and Cosine Similarity.* https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html

25. Framer Motion. (2024). *Production-ready motion library for React.* https://www.framer.com/motion/

26. Tailwind CSS. (2024). *Tailwind CSS v4 Documentation.* https://tailwindcss.com/docs

## 10.3 External Services and APIs

27. The Movie Database (TMDB). (2024). *TMDB API Reference v3.* https://developer.themoviedb.org/reference/intro/getting-started

28. TMDB. (2024). *TMDB Image Configuration — Image Sizes and Base URLs.* https://developer.themoviedb.org/docs/image-basics

29. Neon. (2024). *Neon Serverless PostgreSQL Documentation.* https://neon.tech/docs/introduction

30. python-jose. (2024). *JOSE implementation in Python — JWT encoding and decoding.* https://python-jose.readthedocs.io/

31. bcrypt PyPI. (2024). *bcrypt 4.0.1 — Good password hashing for your software.* https://pypi.org/project/bcrypt/

## 10.4 Standards and Specifications

32. Jones, M., Bradley, J., & Sakimura, N. (2015). *RFC 7519: JSON Web Token (JWT).* Internet Engineering Task Force (IETF). https://datatracker.ietf.org/doc/html/rfc7519

33. Jones, M., & Hildebrand, J. (2015). *RFC 7516: JSON Web Encryption (JWE).* IETF. https://datatracker.ietf.org/doc/html/rfc7516

34. Fielding, R. T. (2000). *Architectural styles and the design of network-based software architectures.* Doctoral Dissertation, University of California, Irvine. (Defines REST architectural style)

35. Prescod, P. (2002). *Second Generation Web Services.* XML.com. (Background on REST vs. SOAP)

---

*End of Report*
