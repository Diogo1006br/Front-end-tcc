"use client";
import React, { useState } from 'react';
 import { FormBuilder } from '@/components/formbuilder/FormBuilder';
 import { FormName } from '@/components/formbuilder/FormName';
 import { Preview } from '@/components/formbuilder/Preview';
import AddProject from '@/components/addproject/addproject';
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  params: { formulario: string };
}

interface State {
  isOverlayActive: boolean;
}

class Form extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOverlayActive: false,
    };
  }

  toggleOverlay = (active: boolean) => {
    this.setState({ isOverlayActive: active });
  };

  render() {
    const { isOverlayActive } = this.state;
    const { params } = this.props; // Desestruture 'params' de 'props'
    const { formulario } = params; // Acesse 'formulario' de 'params'

    return (
      <div className="relative flex min-h-screen w-full flex-col bg-muted/40 mt-8">
        {isOverlayActive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-auto"></div>
        )}

        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-6 sm:pr-6 z-50">
          <Card x-chunk="dashboard-06-chunk-0" className="relative">
            <div className="flex items-center">
              <div className="basis-2/3">
                <CardHeader>
                  <FormName onToggleOverlay={this.toggleOverlay} />
                </CardHeader>
              </div>
            </div>
          </Card>
        </div>

        <Card className="flex-auto p-4 min-h-screen ml-8 mt-2 mr-8 relative z-30">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="mx-auto justify-start gap-2 bg-gray-200 rounded-full mr-2">
              <TabsTrigger
                value="editor"
                className="rounded-full bg-beige-200 text-black hover:bg-beige-300 w-20"
              >
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="rounded-full bg-beige-200 text-black hover:bg-beige-300 w-20"
              >
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent className="w-full" value="editor">
              <FormBuilder/>
            </TabsContent>
            <TabsContent value="preview">
              <Preview />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default Form;
