// Demo stub - not used in carousel demo
const StudentLanguageMetrics = () => null;
export default StudentLanguageMetrics;
        }));

        setMetrics(formattedData);
      } catch (err: any) {
        console.error("Error fetching language metrics:", err);
        setError(err.message);
        toast({
          title: t("error"),
          description: t("failedToLoadMetrics"),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      fetchMetrics();
    }
  }, [studentId, classroomId, toast, t]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <LanguageMetricsChart 
        data={metrics} 
        title={t("languageSkillsProgress")}
      />
    </div>
  );
};

export default StudentLanguageMetrics;
