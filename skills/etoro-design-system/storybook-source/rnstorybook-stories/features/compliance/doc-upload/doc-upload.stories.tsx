import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { DocUpload } from '@etoro/common/compliance/doc-upload/rn';
import type { FileData, UploadResult } from '@etoro/common/compliance/doc-upload/core/interfaces';
import { PDF_PREVIEW_PLACEHOLDER } from '@etoro/common/compliance/doc-upload/core/interfaces';
import { Page, Section, Title, SubTitle, Desc, Preview, CodeBlock, PropsTable, Spacer, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof DocUpload>;

const meta: Meta<typeof DocUpload> = {
  title: 'Features/Compliance/DocUpload',
  component: DocUpload,
  decorators: [
    (Story: React.ComponentType) => (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Story />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    ),
  ],
};

export default meta;

// ─── Mock Data ─────────────────────────────────────────────

const mockImagePreview = {
  uri: 'https://picsum.photos/200/300',
  isPdf: false,
  isVertical: true,
};

const mockPdfPreview = {
  uri: PDF_PREVIEW_PLACEHOLDER,
  isPdf: true,
  filename: 'bank_statement.pdf',
};

const mockUploadHandler = async (file: FileData, slotIndex: number): Promise<UploadResult> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const isPdf = file.mimeType.toLowerCase().includes('pdf');
  return {
    fileId: slotIndex + 1,
    preview: isPdf
      ? { uri: PDF_PREVIEW_PLACEHOLDER, isPdf: true, filename: file.name }
      : {
          uri: file.uri,
          isPdf: false,
          isVertical: file.height !== undefined && file.width !== undefined && file.height > file.width,
        },
  };
};

// ─── Stories ───────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>
          Single-card upload with default configuration. Tapping the card opens a bottom sheet to pick a file from camera, gallery, or document
          picker.
        </Desc>
        <Preview>
          <View style={{ width: '100%' }}>
            <DocUpload slots={[{ id: 'front', label: 'Front side' }]} onUpload={mockUploadHandler} testID="basic-story" />
          </View>
        </Preview>
        <CodeBlock
          code={`import { DocUpload } from '@etoro/common/compliance/doc-upload/rn';
import type {
  UploadResult,
  FileData,
} from '@etoro/common/compliance/doc-upload/core/interfaces';

<DocUpload
  slots={[{ id: 'front', label: 'Front side' }]}
  onUpload={async (file, slotIndex) => {
    const result = await myApi.upload(file);
    return {
      fileId: result.id,
      preview: { uri: file.uri, isPdf: false },
    };
  }}
/>`}
        />
      </Section>
    </Page>
  ),
};

export const States: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Card States</Title>
        <Desc>Each upload card independently manages its own state: empty, loading, success, or error. Below are the key visual states.</Desc>
      </Section>

      <Section>
        <SubTitle>Empty</SubTitle>
        <Preview>
          <View style={{ width: '100%' }}>
            <DocUpload slots={[{ id: 'empty', label: 'docUpload.tapToUpload' }]} onUpload={mockUploadHandler} testID="state-empty" />
          </View>
        </Preview>
      </Section>

      <Section>
        <SubTitle>Success (Image)</SubTitle>
        <Preview>
          <View style={{ width: '100%' }}>
            <DocUpload
              slots={[{ id: 'success-img', label: 'Front side' }]}
              onUpload={mockUploadHandler}
              initialPreviews={{ 'success-img': mockImagePreview }}
              testID="state-success-img"
            />
          </View>
        </Preview>
      </Section>

      <Section>
        <SubTitle>Success (PDF)</SubTitle>
        <Preview>
          <View style={{ width: '100%' }}>
            <DocUpload
              slots={[{ id: 'success-pdf', label: 'Front side' }]}
              onUpload={mockUploadHandler}
              initialPreviews={{ 'success-pdf': mockPdfPreview }}
              testID="state-success-pdf"
            />
          </View>
        </Preview>
      </Section>

      <Section>
        <SubTitle>Disabled</SubTitle>
        <Preview>
          <View style={{ width: '100%' }}>
            <DocUpload slots={[{ id: 'disabled', label: 'Front side' }]} onUpload={mockUploadHandler} disabled testID="state-disabled" />
          </View>
        </Preview>
      </Section>
    </Page>
  ),
};

export const MultiCard: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Multi-Card Layout</Title>
        <Desc>Multiple cards with independent state per card. Common for documents requiring front and back sides.</Desc>
      </Section>

      <Section>
        <SubTitle>Front uploaded, Back empty</SubTitle>
        <Preview>
          <View style={{ width: '100%' }}>
            <DocUpload
              slots={[
                { id: 'front', label: 'Front side' },
                { id: 'back', label: 'Back side' },
              ]}
              onUpload={mockUploadHandler}
              initialPreviews={{ front: mockImagePreview }}
              testID="multi-a"
            />
          </View>
        </Preview>
      </Section>

      <Section>
        <SubTitle>Both uploaded</SubTitle>
        <Preview>
          <View style={{ width: '100%' }}>
            <DocUpload
              slots={[
                { id: 'front', label: 'Front side' },
                { id: 'back', label: 'Back side' },
              ]}
              onUpload={mockUploadHandler}
              initialPreviews={{
                front: mockImagePreview,
                back: mockImagePreview,
              }}
              testID="multi-b"
            />
          </View>
        </Preview>
      </Section>
    </Page>
  ),
};

export const KYCExample: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>KYC Example</Title>
        <Desc>Real-world usage for identity verification with title, subtitle, two-sided document, and all callback hooks.</Desc>
        <Preview>
          <View style={{ width: '100%' }}>
            <DocUpload
              slots={[
                { id: 'front', label: 'Front side' },
                { id: 'back', label: 'Back side' },
              ]}
              title="Upload your driver's license"
              subtitle="Two photos required, front and back."
              onUpload={mockUploadHandler}
              onRemove={(slotIndex) => console.log('Removed slot:', slotIndex)}
              onFileSelected={(file, slotIndex) => console.log('Selected:', file.name, 'slot:', slotIndex)}
              testID="kyc-example"
            />
          </View>
        </Preview>
        <CodeBlock
          code={`<DocUpload
  slots={[
    { id: 'front', label: 'Front side' },
    { id: 'back', label: 'Back side' },
  ]}
  title="Upload your driver's license"
  subtitle="Two photos required, front and back."
  onUpload={handleUpload}
  onRemove={(slotIndex) => clearFile(slotIndex)}
/>`}
        />
      </Section>

      <Section>
        <SubTitle>Translation Keys (compliance namespace)</SubTitle>
        <Desc>The component uses useTranslation('compliance'). All fixed UI strings are in compliance.json under the docUpload key.</Desc>
        <CodeBlock
          title="json"
          code={`{
  "docUpload": {
    "tapToUpload": "Tap to upload",
    "uploading": "Uploading...",
    "remove": "Remove",
    "useCamera": "Use camera",
    "pickFromGallery": "Pick from gallery",
    "pickFile": "Pick file",
    "errors": {
      "invalidFormat": "Please upload one of the following...",
      "fileTooLarge": "File is too big. Maximum size is {{maxFileSize}}MB",
      "serverError": "Error uploading file. Please try again."
    }
  }
}`}
        />
      </Section>
    </Page>
  ),
};

export const StateTransitions: Story = {
  render: function StateTransitionsStory() {
    const { c } = useTheme();
    const [autoPlay, setAutoPlay] = useState(false);
    const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const autoPlayRef = useRef(autoPlay);
    const [phase, setPhase] = useState<'empty' | 'loading' | 'success'>('empty');
    const uploadResolveRef = useRef<((value: UploadResult) => void) | null>(null);
    const lastFileRef = useRef<FileData | null>(null);

    const onUpload = useCallback(async (file: FileData) => {
      lastFileRef.current = file;
      setPhase('loading');
      return new Promise<UploadResult>((resolve) => {
        uploadResolveRef.current = resolve;
      });
    }, []);

    const completeUpload = useCallback(() => {
      if (uploadResolveRef.current) {
        const file = lastFileRef.current;
        const isPdf = (file?.mimeType ?? '').toLowerCase().includes('pdf');
        const preview = isPdf
          ? { uri: PDF_PREVIEW_PLACEHOLDER, isPdf: true, filename: file?.name }
          : {
              uri: file?.uri ?? '',
              isPdf: false,
              isVertical: file?.height !== undefined && file?.width !== undefined && file.height > file.width,
            };
        uploadResolveRef.current({ fileId: 1, preview });
        uploadResolveRef.current = null;
        setPhase('success');
      }
    }, []);

    useEffect(() => {
      autoPlayRef.current = autoPlay;
    }, [autoPlay]);

    useEffect(() => {
      if (!autoPlay) {
        if (cycleRef.current) clearTimeout(cycleRef.current);
        return;
      }

      const cycle = async () => {
        await new Promise((r) => {
          cycleRef.current = setTimeout(r, 1000);
        });
        if (!autoPlayRef.current) return;

        setPhase('loading');
        await new Promise((r) => {
          cycleRef.current = setTimeout(r, 1500);
        });
        if (!autoPlayRef.current) return;

        completeUpload();
        await new Promise((r) => {
          cycleRef.current = setTimeout(r, 2000);
        });
        if (!autoPlayRef.current) return;

        setPhase('empty');
        await new Promise((r) => {
          cycleRef.current = setTimeout(r, 2000);
        });
        if (!autoPlayRef.current) return;

        cycle();
      };

      cycle();

      return () => {
        if (cycleRef.current) clearTimeout(cycleRef.current);
      };
    }, [autoPlay, completeUpload]);

    return (
      <Page>
        <Section>
          <Title>State Transitions</Title>
          <Desc>Demonstrates animated transitions between card states. Use auto-cycle or trigger transitions manually.</Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <DocUpload slots={[{ id: 'transition-demo', label: 'Front side' }]} onUpload={onUpload} testID="transition-demo" />
            </View>
          </Preview>
        </Section>

        <Section>
          <SubTitle>Controls</SubTitle>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            <Pressable
              style={{
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: autoPlay ? c.accent : c.accentText,
              }}
              onPress={() => setAutoPlay((prev) => !prev)}
            >
              <View>
                <Desc>{autoPlay ? 'Stop Auto-Cycle' : 'Start Auto-Cycle'}</Desc>
              </View>
            </Pressable>
            <Pressable
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: c.border,
              }}
              onPress={completeUpload}
            >
              <View>
                <Desc>Complete Upload</Desc>
              </View>
            </Pressable>
          </View>
          <Desc>{`Current phase: ${phase}`}</Desc>
        </Section>
      </Page>
    );
  },
};

/**
 * API Reference — always the LAST exported story.
 */
export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>DocUploadBoxProps</SubTitle>
        <PropsTable
          data={[
            {
              prop: 'slots',
              type: 'UploadSlotConfig[]',
              default: '(required)',
            },
            {
              prop: 'onUpload',
              type: '(file, idx) => Promise<Result>',
              default: '(required)',
            },
            { prop: 'title', type: 'string', default: '—' },
            { prop: 'subtitle', type: 'string', default: '—' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'onRemove', type: '(slotIndex) => void', default: '—' },
            {
              prop: 'onFileSelected',
              type: '(file, idx) => void',
              default: '—',
            },
            {
              prop: 'acceptedFormats',
              type: 'string[]',
              default: "['pdf','jpeg',...]",
            },
            { prop: 'maxFileSizeMB', type: 'number', default: '8' },
            {
              prop: 'initialPreviews',
              type: 'Record<string, Preview>',
              default: '{}',
            },
            { prop: 'testID', type: 'string', default: '—' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>UploadSlotConfig</SubTitle>
        <PropsTable
          data={[
            { prop: 'id', type: 'string', default: '(required)' },
            { prop: 'label', type: 'string', default: '(required)' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>UploadResult</SubTitle>
        <PropsTable
          data={[
            { prop: 'fileId', type: 'number', default: '(required)' },
            { prop: 'preview', type: 'PreviewImage', default: '(required)' },
          ]}
        />
      </Section>

      <Spacer />
    </Page>
  ),
};
