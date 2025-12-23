-- Migration: Product Documents Junction Table
-- Purpose: Link products with documents (datasheets, manuals, certificates)
-- Created: 2024-12-24

-- Create junction table for many-to-many relationship
CREATE TABLE public.product_documents (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (product_id, document_id)
);

-- Comment for documentation
COMMENT ON TABLE public.product_documents IS 'Junction table linking products to their related documents (datasheets, manuals, certificates)';
COMMENT ON COLUMN public.product_documents.sort_order IS 'Display order of documents for a product';

-- Indexes for efficient queries
CREATE INDEX idx_product_documents_product ON public.product_documents(product_id);
CREATE INDEX idx_product_documents_document ON public.product_documents(document_id);

-- Enable Row Level Security
ALTER TABLE public.product_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view all product-document relationships
CREATE POLICY "Product documents viewable by everyone"
    ON public.product_documents
    FOR SELECT
    USING (true);

-- Editors and admins can manage product-document relationships
CREATE POLICY "Editors can insert product documents"
    ON public.product_documents
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
            AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Editors can update product documents"
    ON public.product_documents
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
            AND role IN ('admin', 'editor')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
            AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Editors can delete product documents"
    ON public.product_documents
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
            AND role IN ('admin', 'editor')
        )
    );
