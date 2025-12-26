export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      article_translations: {
        Row: {
          article_id: string
          content: Json
          excerpt: string | null
          id: string
          locale: string
          seo_description: string | null
          seo_title: string | null
          title: string
        }
        Insert: {
          article_id: string
          content: Json
          excerpt?: string | null
          id?: string
          locale: string
          seo_description?: string | null
          seo_title?: string | null
          title: string
        }
        Update: {
          article_id?: string
          content?: Json
          excerpt?: string | null
          id?: string
          locale?: string
          seo_description?: string | null
          seo_title?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_translations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string
          category_id: string | null
          created_at: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["article_status"] | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          category_id?: string | null
          created_at?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"] | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string | null
          created_at?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"] | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          client_logo_url: string | null
          client_name: string
          created_at: string | null
          featured_image_url: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          is_featured: boolean | null
          published_at: string | null
          slug: string
          sort_order: number | null
          station_count: number | null
          updated_at: string | null
        }
        Insert: {
          client_logo_url?: string | null
          client_name: string
          created_at?: string | null
          featured_image_url?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          slug: string
          sort_order?: number | null
          station_count?: number | null
          updated_at?: string | null
        }
        Update: {
          client_logo_url?: string | null
          client_name?: string
          created_at?: string | null
          featured_image_url?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          slug?: string
          sort_order?: number | null
          station_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      case_study_images: {
        Row: {
          alt: string | null
          case_study_id: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          sort_order: number | null
          url: string
        }
        Insert: {
          alt?: string | null
          case_study_id: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          sort_order?: number | null
          url: string
        }
        Update: {
          alt?: string | null
          case_study_id?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          sort_order?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_study_images_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      case_study_metric_translations: {
        Row: {
          id: string
          label: string
          locale: string
          metric_id: string
        }
        Insert: {
          id?: string
          label: string
          locale: string
          metric_id: string
        }
        Update: {
          id?: string
          label?: string
          locale?: string
          metric_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_study_metric_translations_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "case_study_metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      case_study_metrics: {
        Row: {
          case_study_id: string
          created_at: string | null
          icon: string | null
          id: string
          sort_order: number | null
          value: string
        }
        Insert: {
          case_study_id: string
          created_at?: string | null
          icon?: string | null
          id?: string
          sort_order?: number | null
          value: string
        }
        Update: {
          case_study_id?: string
          created_at?: string | null
          icon?: string | null
          id?: string
          sort_order?: number | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_study_metrics_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      case_study_translations: {
        Row: {
          case_study_id: string
          challenge: string | null
          id: string
          locale: string
          results: string | null
          seo_description: string | null
          seo_title: string | null
          solution: string | null
          subtitle: string | null
          testimonial_author: string | null
          testimonial_text: string | null
          title: string
        }
        Insert: {
          case_study_id: string
          challenge?: string | null
          id?: string
          locale: string
          results?: string | null
          seo_description?: string | null
          seo_title?: string | null
          solution?: string | null
          subtitle?: string | null
          testimonial_author?: string | null
          testimonial_text?: string | null
          title: string
        }
        Update: {
          case_study_id?: string
          challenge?: string | null
          id?: string
          locale?: string
          results?: string | null
          seo_description?: string | null
          seo_title?: string | null
          solution?: string | null
          subtitle?: string | null
          testimonial_author?: string | null
          testimonial_text?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_study_translations_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_translations: {
        Row: {
          category_id: string
          description: string | null
          id: string
          locale: string
          name: string
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          locale: string
          name: string
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          locale?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      company_details: {
        Row: {
          address: string
          city: string
          country: string | null
          created_at: string | null
          dic: string | null
          division: string | null
          facebook_url: string | null
          hours_saturday: string | null
          hours_sunday: string | null
          hours_weekdays: string | null
          ico: string
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          name: string
          sales_email: string | null
          sales_phone: string | null
          service_email: string | null
          service_phone: string | null
          updated_at: string | null
          youtube_url: string | null
          zip: string
        }
        Insert: {
          address: string
          city: string
          country?: string | null
          created_at?: string | null
          dic?: string | null
          division?: string | null
          facebook_url?: string | null
          hours_saturday?: string | null
          hours_sunday?: string | null
          hours_weekdays?: string | null
          ico: string
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          name: string
          sales_email?: string | null
          sales_phone?: string | null
          service_email?: string | null
          service_phone?: string | null
          updated_at?: string | null
          youtube_url?: string | null
          zip: string
        }
        Update: {
          address?: string
          city?: string
          country?: string | null
          created_at?: string | null
          dic?: string | null
          division?: string | null
          facebook_url?: string | null
          hours_saturday?: string | null
          hours_sunday?: string | null
          hours_weekdays?: string | null
          ico?: string
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          name?: string
          sales_email?: string | null
          sales_phone?: string | null
          service_email?: string | null
          service_phone?: string | null
          updated_at?: string | null
          youtube_url?: string | null
          zip?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string
          contact_person: string
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          location: string
          message: string
          notes: string | null
          phone: string | null
          segment: string
          station_type: string
          updated_at: string | null
        }
        Insert: {
          company: string
          contact_person: string
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          location: string
          message: string
          notes?: string | null
          phone?: string | null
          segment: string
          station_type: string
          updated_at?: string | null
        }
        Update: {
          company?: string
          contact_person?: string
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          location?: string
          message?: string
          notes?: string | null
          phone?: string | null
          segment?: string
          station_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      corporate_benefit_translations: {
        Row: {
          benefit_id: string
          description: string | null
          id: string
          locale: string
          title: string
        }
        Insert: {
          benefit_id: string
          description?: string | null
          id?: string
          locale: string
          title: string
        }
        Update: {
          benefit_id?: string
          description?: string | null
          id?: string
          locale?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "corporate_benefit_translations_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "corporate_benefits"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_benefits: {
        Row: {
          color_accent: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          page_id: string | null
          section_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color_accent?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          page_id?: string | null
          section_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color_accent?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          page_id?: string | null
          section_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_benefits_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "corporate_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corporate_benefits_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "corporate_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_page_translations: {
        Row: {
          hero_heading: string | null
          hero_subheading: string | null
          id: string
          locale: string
          page_id: string
          seo_description: string | null
          seo_title: string | null
          subtitle: string | null
          title: string
        }
        Insert: {
          hero_heading?: string | null
          hero_subheading?: string | null
          id?: string
          locale: string
          page_id: string
          seo_description?: string | null
          seo_title?: string | null
          subtitle?: string | null
          title: string
        }
        Update: {
          hero_heading?: string | null
          hero_subheading?: string | null
          id?: string
          locale?: string
          page_id?: string
          seo_description?: string | null
          seo_title?: string | null
          subtitle?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "corporate_page_translations_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "corporate_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_pages: {
        Row: {
          created_at: string | null
          hero_image_url: string | null
          hero_video_url: string | null
          id: string
          is_active: boolean | null
          page_type: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          hero_image_url?: string | null
          hero_video_url?: string | null
          id?: string
          is_active?: boolean | null
          page_type: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          hero_image_url?: string | null
          hero_video_url?: string | null
          id?: string
          is_active?: boolean | null
          page_type?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      corporate_section_translations: {
        Row: {
          content: Json | null
          heading: string | null
          id: string
          locale: string
          section_id: string
          subheading: string | null
        }
        Insert: {
          content?: Json | null
          heading?: string | null
          id?: string
          locale: string
          section_id: string
          subheading?: string | null
        }
        Update: {
          content?: Json | null
          heading?: string | null
          id?: string
          locale?: string
          section_id?: string
          subheading?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_section_translations_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "corporate_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_sections: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          page_id: string
          section_type: Database["public"]["Enums"]["corporate_section_type"]
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page_id: string
          section_type: Database["public"]["Enums"]["corporate_section_type"]
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page_id?: string
          section_type?: Database["public"]["Enums"]["corporate_section_type"]
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "corporate_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      document_categories: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      document_category_translations: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          id: string
          locale: string
          name: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          locale: string
          name: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          locale?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      document_translations: {
        Row: {
          created_at: string | null
          description: string | null
          document_id: string
          id: string
          locale: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          document_id: string
          id?: string
          locale: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          document_id?: string
          id?: string
          locale?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_translations_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category_id: string
          created_at: string | null
          fallback_locale: string | null
          file_cs: string | null
          file_de: string | null
          file_en: string | null
          file_size_cs: number | null
          file_size_de: number | null
          file_size_en: number | null
          id: string
          is_active: boolean | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          fallback_locale?: string | null
          file_cs?: string | null
          file_de?: string | null
          file_en?: string | null
          file_size_cs?: number | null
          file_size_de?: number | null
          file_size_en?: number | null
          id?: string
          is_active?: boolean | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          fallback_locale?: string | null
          file_cs?: string | null
          file_de?: string | null
          file_en?: string | null
          file_size_cs?: number | null
          file_size_de?: number | null
          file_size_en?: number | null
          id?: string
          is_active?: boolean | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_translations: {
        Row: {
          answer: string
          faq_id: string
          id: string
          locale: string
          question: string
        }
        Insert: {
          answer: string
          faq_id: string
          id?: string
          locale: string
          question: string
        }
        Update: {
          answer?: string
          faq_id?: string
          id?: string
          locale?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "faq_translations_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "faqs"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string | null
          file_path: string
          file_size: number
          filename: string
          id: string
          mime_type: string
          original_filename: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          file_path: string
          file_size: number
          filename: string
          id?: string
          mime_type: string
          original_filename: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          file_path?: string
          file_size?: number
          filename?: string
          id?: string
          mime_type?: string
          original_filename?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          locale: string
          subscribed_at: string | null
          unsubscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          locale: string
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          locale?: string
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_color_variant_translations: {
        Row: {
          id: string
          label: string
          locale: string
          variant_id: string
        }
        Insert: {
          id?: string
          label: string
          locale: string
          variant_id: string
        }
        Update: {
          id?: string
          label?: string
          locale?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_color_variant_translations_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_color_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_color_variants: {
        Row: {
          color_key: string
          created_at: string | null
          id: string
          image_url: string
          product_id: string
          sort_order: number | null
        }
        Insert: {
          color_key: string
          created_at?: string | null
          id?: string
          image_url: string
          product_id: string
          sort_order?: number | null
        }
        Update: {
          color_key?: string
          created_at?: string | null
          id?: string
          image_url?: string
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_color_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_content_section_translations: {
        Row: {
          content: string
          id: string
          locale: string
          section_id: string
          subtitle: string | null
          title: string
        }
        Insert: {
          content: string
          id?: string
          locale: string
          section_id: string
          subtitle?: string | null
          title: string
        }
        Update: {
          content?: string
          id?: string
          locale?: string
          section_id?: string
          subtitle?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_content_section_translations_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "product_content_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      product_content_sections: {
        Row: {
          created_at: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          product_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          product_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_content_sections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_documents: {
        Row: {
          created_at: string | null
          document_id: string
          product_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          document_id: string
          product_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          document_id?: string
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feature_point_translations: {
        Row: {
          feature_point_id: string
          id: string
          label: string
          locale: string
          value: string
        }
        Insert: {
          feature_point_id: string
          id?: string
          label: string
          locale: string
          value: string
        }
        Update: {
          feature_point_id?: string
          id?: string
          label?: string
          locale?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_feature_point_translations_feature_point_id_fkey"
            columns: ["feature_point_id"]
            isOneToOne: false
            referencedRelation: "product_feature_points"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feature_points: {
        Row: {
          created_at: string | null
          icon: string
          id: string
          position: string
          product_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          icon: string
          id?: string
          position: string
          product_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          icon?: string
          id?: string
          position?: string
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_feature_points_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feature_translations: {
        Row: {
          description: string | null
          feature_id: string
          id: string
          locale: string
          name: string
        }
        Insert: {
          description?: string | null
          feature_id: string
          id?: string
          locale: string
          name: string
        }
        Update: {
          description?: string | null
          feature_id?: string
          id?: string
          locale?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_feature_translations_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "product_features"
            referencedColumns: ["id"]
          },
        ]
      }
      product_features: {
        Row: {
          icon: string | null
          id: string
          slug: string
        }
        Insert: {
          icon?: string | null
          id?: string
          slug: string
        }
        Update: {
          icon?: string | null
          id?: string
          slug?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_specifications: {
        Row: {
          group_name: string | null
          id: string
          label_cs: string | null
          label_de: string | null
          label_en: string | null
          product_id: string
          sort_order: number | null
          spec_key: string
          unit: string | null
          value: string
        }
        Insert: {
          group_name?: string | null
          id?: string
          label_cs?: string | null
          label_de?: string | null
          label_en?: string | null
          product_id: string
          sort_order?: number | null
          spec_key: string
          unit?: string | null
          value: string
        }
        Update: {
          group_name?: string | null
          id?: string
          label_cs?: string | null
          label_de?: string | null
          label_en?: string | null
          product_id?: string
          sort_order?: number | null
          spec_key?: string
          unit?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_specifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_to_features: {
        Row: {
          feature_id: string
          product_id: string
        }
        Insert: {
          feature_id: string
          product_id: string
        }
        Update: {
          feature_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_to_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "product_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_to_features_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_translations: {
        Row: {
          description: string | null
          id: string
          locale: string
          name: string
          product_id: string
          seo_description: string | null
          seo_title: string | null
          tagline: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          locale: string
          name: string
          product_id: string
          seo_description?: string | null
          seo_title?: string | null
          tagline?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          locale?: string
          name?: string
          product_id?: string
          seo_description?: string | null
          seo_title?: string | null
          tagline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          country_of_origin: string | null
          created_at: string | null
          datasheet_filename: string | null
          datasheet_url: string | null
          front_image: string | null
          hero_image: string | null
          hero_video: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          manufacturer_name: string | null
          manufacturer_url: string | null
          power: string | null
          product_category: string | null
          sku: string | null
          slug: string
          sort_order: number | null
          type: Database["public"]["Enums"]["product_type"]
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          datasheet_filename?: string | null
          datasheet_url?: string | null
          front_image?: string | null
          hero_image?: string | null
          hero_video?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          manufacturer_name?: string | null
          manufacturer_url?: string | null
          power?: string | null
          product_category?: string | null
          sku?: string | null
          slug: string
          sort_order?: number | null
          type: Database["public"]["Enums"]["product_type"]
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          datasheet_filename?: string | null
          datasheet_url?: string | null
          front_image?: string | null
          hero_image?: string | null
          hero_video?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          manufacturer_name?: string | null
          manufacturer_url?: string | null
          power?: string | null
          product_category?: string | null
          sku?: string | null
          slug?: string
          sort_order?: number | null
          type?: Database["public"]["Enums"]["product_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      team_member_translations: {
        Row: {
          description: string | null
          id: string
          locale: string
          name: string
          position: string
          team_member_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          locale: string
          name: string
          position: string
          team_member_id: string
        }
        Update: {
          description?: string | null
          id?: string
          locale?: string
          name?: string
          position?: string
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_translations_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string | null
          email: string
          id: string
          image_url: string | null
          is_active: boolean | null
          linkedin_url: string | null
          phone: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          phone?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          phone?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      article_status: "draft" | "scheduled" | "published" | "archived"
      corporate_section_type:
        | "hero"
        | "client_logos"
        | "solution_desc"
        | "stations"
        | "case_study"
        | "gallery"
        | "inquiry_form"
        | "benefits"
        | "features"
        | "cta"
        | "text_content"
        | "faq"
      product_type: "ac_mybox" | "dc_alpitronic"
      user_role: "admin" | "editor" | "author"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      article_status: ["draft", "scheduled", "published", "archived"],
      corporate_section_type: [
        "hero",
        "client_logos",
        "solution_desc",
        "stations",
        "case_study",
        "gallery",
        "inquiry_form",
        "benefits",
        "features",
        "cta",
        "text_content",
        "faq",
      ],
      product_type: ["ac_mybox", "dc_alpitronic"],
      user_role: ["admin", "editor", "author"],
    },
  },
} as const

