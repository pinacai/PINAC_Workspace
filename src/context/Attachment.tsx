import React, { createContext, useState } from "react";

const AttachmentContext = createContext<{
  attachment: File | null;
  setAttachment: React.Dispatch<React.SetStateAction<File | null>>;
} | null>(null);

interface AttachmentProviderProps {
  children: React.ReactNode;
}

const AttachmentProvider: React.FC<AttachmentProviderProps> = ({
  children,
}) => {
  const [attachment, setAttachment] = useState<File | null>(null);

  return (
    <AttachmentContext.Provider value={{ attachment, setAttachment }}>
      {children}
    </AttachmentContext.Provider>
  );
};

export { AttachmentContext, AttachmentProvider };
